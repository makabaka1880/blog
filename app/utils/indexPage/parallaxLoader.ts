export async function setupStripShader(canvas: HTMLCanvasElement) {
    if (!canvas) return;

    // 1. Set internal resolution to match CSS size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    const gl = canvas.getContext('webgl')!;
    if (!gl) return;

    // Helper to load images as WebGL textures
    const loadTexture = (url: string): Promise<WebGLTexture> => {
        return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => {
                const tex = gl.createTexture()!;
                gl.bindTexture(gl.TEXTURE_2D, tex);
                // Parameters to handle non-power-of-two images (common in web)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                resolve(tex);
            };
            image.src = url;
        });
    };

    // Vertex shader
    const vertSrc = `
        attribute vec4 a_position;
        varying vec2 v_uv;
        void main() {
            gl_Position = a_position;
            // Convert clip space (-1 to 1) to UV space (0 to 1)
            v_uv = a_position.xy * 0.5 + 0.5;
        }
    `;

    const fragSrc = await fetch('/assets/index/parallax.glsl')
        .then(res => res.text())
        .catch(() => `
            precision mediump float;
            void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }
        `);

    function compileShader(type: number, source: string) {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Geometry setup
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uOffsetLoc = gl.getUniformLocation(program, 'u_offset');
    const uSamplerLoc = gl.getUniformLocation(program, 'u_texture');
    const uDepthLoc = gl.getUniformLocation(program, 'u_depth');
    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uImageResLoc = gl.getUniformLocation(program, 'u_imageRes');

    const imageWidth = 13537; // Replace with actual width
    const imageHeight = 3873;

    // Load assets in parallel
    const [colorTex, depthTex] = await Promise.all([
        loadTexture('/assets/index/bg-strip-color.webp'),
        loadTexture('/assets/index/bg-strip-depthmap.webp')
    ]);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const render = (y: number) => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform1f(uOffsetLoc, y);
        gl.uniform2f(uResLoc, canvas.width, canvas.height);
        gl.uniform2f(uImageResLoc, imageWidth, imageHeight);

        // Bind Color to Unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, colorTex);
        gl.uniform1i(uSamplerLoc, 0);

        // Bind Depth to Unit 1
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, depthTex);
        gl.uniform1i(uDepthLoc, 1);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // Initial draw
    requestAnimationFrame(() => render(0));

    return { render };
}