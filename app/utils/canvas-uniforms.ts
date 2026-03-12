export type UniformDTO =
    | { tag: "float"; value: number }

    | { tag: "vec2"; x: number; y: number }
    | { tag: "vec3"; x: number; y: number; z: number }
    | { tag: "vec4"; x: number; y: number; z: number; w: number }

    | { tag: "int"; value: number }
    | { tag: "bool"; value: boolean }

    | { tag: "mat2"; value: number[] } // length 4
    | { tag: "mat3"; value: number[] } // length 9
    | { tag: "mat4"; value: number[] } // length 16

    | { tag: "sampler2D"; src: string }
    | { tag: "samplerCube"; src: string[] }


export type TextureUnit = number & { readonly __brand: "TextureUnit" }
type GLfloat = number;

export type GPUUniform =
    | { tag: "float"; value: GLfloat }

    | { tag: "vec2"; x: GLfloat; y: GLfloat }
    | { tag: "vec3"; x: GLfloat; y: GLfloat; z: GLfloat }
    | { tag: "vec4"; x: GLfloat; y: GLfloat; z: GLfloat; w: GLfloat }

    | { tag: "int"; value: number }
    | { tag: "bool"; value: number }

    | { tag: "mat2"; value: Iterable<GLfloat> } // 4 values
    | { tag: "mat3"; value: Iterable<GLfloat> } // 9 values
    | { tag: "mat4"; value: Iterable<GLfloat> } // 16 values

    | {
        tag: "sampler2D"
        texture: WebGLTexture
        unit: TextureUnit
    }

    | {
        tag: "samplerCube"
        texture: WebGLTexture
        unit: TextureUnit
    }


export function compileUniformDTO(
    gl: WebGLRenderingContext,
    dto: UniformDTO,
    getOrCreateTexture: (src: string, loader: (src: string, gl: WebGLRenderingContext) => WebGLTexture) => { unit: TextureUnit; texture: WebGLTexture },
    textureLoader: (src: string, gl: WebGLRenderingContext) => WebGLTexture
): GPUUniform {

    switch (dto.tag) {

        case "float":
            return { tag: "float", value: dto.value }

        case "int":
            return { tag: "int", value: dto.value }

        case "bool":
            return { tag: "bool", value: dto.value ? 1 : 0 }

        case "vec2":
            return {
                tag: "vec2",
                x: dto.x,
                y: dto.y
            }

        case "vec3":
            return {
                tag: "vec3",
                x: dto.x,
                y: dto.y,
                z: dto.z
            }

        case "vec4":
            return {
                tag: "vec4",
                x: dto.x,
                y: dto.y,
                z: dto.z,
                w: dto.w
            }

        case "mat2":
            if (dto.value.length !== 4)
                throw new Error("mat2 must have length 4")
            return {
                tag: "mat2",
                value: dto.value
            }

        case "mat3":
            if (dto.value.length !== 9)
                throw new Error("mat3 must have length 9")
            return {
                tag: "mat3",
                value: dto.value
            }

        case "mat4":
            if (dto.value.length !== 16)
                throw new Error("mat4 must have length 16")
            return {
                tag: "mat4",
                value: dto.value
            }

        case "sampler2D": {
            const { unit, texture } = getOrCreateTexture(dto.src, textureLoader)
            return { tag: "sampler2D", texture, unit }
        }

        case "samplerCube": {
            // For cube maps, we use the first source as cache key
            const cacheKey = dto.src.join('|')
            const { unit, texture } = getOrCreateTexture(cacheKey, textureLoader)
            return { tag: "samplerCube", texture, unit }
        }
    }
}

export function bindUniform(
    uniform: GPUUniform,
    gl: WebGLRenderingContext,
    location: WebGLUniformLocation
) {
    switch (uniform.tag) {
        case "float":
            gl.uniform1f(location, uniform.value);
            break;

        case "vec2":
            gl.uniform2f(location, uniform.x, uniform.y);
            break;

        case "vec3":
            gl.uniform3f(location, uniform.x, uniform.y, uniform.z);
            break;

        case "vec4":
            gl.uniform4f(location, uniform.x, uniform.y, uniform.z, uniform.w);
            break;

        case "int":
            gl.uniform1i(location, uniform.value);
            break;

        case "bool":
            gl.uniform1i(location, uniform.value);
            break;

        case "mat2":
            gl.uniformMatrix2fv(location, false, Array.from(uniform.value));
            break;

        case "mat3":
            gl.uniformMatrix3fv(location, false, Array.from(uniform.value));
            break;

        case "mat4":
            gl.uniformMatrix4fv(location, false, Array.from(uniform.value));
            break;

        case "sampler2D":
            gl.uniform1i(location, uniform.unit);
            gl.activeTexture(gl.TEXTURE0 + uniform.unit);
            gl.bindTexture(gl.TEXTURE_2D, uniform.texture);
            break;

        case "samplerCube":
            gl.uniform1i(location, uniform.unit);
            gl.activeTexture(gl.TEXTURE0 + uniform.unit);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, uniform.texture);
            break;
    }
}


// M
export const httpImageLoad = (url: string, gl: WebGLRenderingContext) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );

    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image,
        );

        // WebGL1 has different requirements for power of 2 images
        // vs. non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}
export function createTextureUnitAllocator(
    gl: WebGLRenderingContext
) {

    const maxUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
    let nextUnit = 0
    const textureCache = new Map<string, { unit: TextureUnit; texture: WebGLTexture }>()

    function allocate(): TextureUnit {
        if (nextUnit >= maxUnits) {
            throw new Error("Exceeded MAX_TEXTURE_IMAGE_UNITS")
        }

        const unit = nextUnit as TextureUnit
        nextUnit += 1
        return unit
    }

    function getOrCreateTexture(src: string, loader: (src: string, gl: WebGLRenderingContext) => WebGLTexture): { unit: TextureUnit; texture: WebGLTexture } {
        if (textureCache.has(src)) {
            return textureCache.get(src)!
        }

        const unit = allocate()
        const texture = loader(src, gl)
        textureCache.set(src, { unit, texture })
        return { unit, texture }
    }

    function reset() {
        nextUnit = 0
        textureCache.clear()
    }

    return { allocate, getOrCreateTexture, reset }
}


const isPowerOf2 = (value: number) => (value & (value - 1)) === 0;