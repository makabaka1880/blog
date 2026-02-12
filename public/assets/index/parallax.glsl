precision mediump float;

uniform sampler2D u_texture;
uniform sampler2D u_depth;
uniform vec2 u_resolution;
uniform vec2 u_imageRes;
uniform float u_offset;

varying vec2 v_uv;

// Rotation helper function
vec2 rotate(vec2 v, float angle, vec2 pivot) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, -s, s, c);
    return m * (v - pivot) + pivot;
}

vec2 getImageUv(vec2 screenUv) {
    float imageAspect = u_imageRes.x / u_imageRes.y;
    float canvasAspect = u_resolution.x / u_resolution.y;
    float horizontalScale = canvasAspect / imageAspect;
    float shiftFactor = 1. - horizontalScale;
    float alignmentOffset = shiftFactor * .15;
    
    return vec2(
        (screenUv.x * horizontalScale) + alignmentOffset,
        1. - screenUv.y
    );
}

vec2 getDisplacedUv(vec2 baseUv, vec4 depthData, vec2 view) {
    float depth = depthData.r;
    vec2 displacement = (depth - .5) * view;
    return baseUv + displacement;
}

vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.0);
    return mix(m, 2.0 - m, step(1.0, m));
}

void main() {
    vec2 baseUv = getImageUv(v_uv);
    vec4 sampledDepth = texture2D(u_depth, baseUv);
    
    float depth = sampledDepth.r;
    float delineatedDepth = pow(abs(depth - .5), 1.) * sign(depth - .5) + .5;
    vec4 enhancedDepth = vec4(vec3(delineatedDepth), 1.);
    
    float sensitivity = .0004;
    float displaced = -(u_offset - 550.) * sensitivity;
    vec2 displacedUv = getDisplacedUv(baseUv, enhancedDepth, vec2(.0, displaced));
    
    float rotationAngle = displaced * 0.2;
    vec2 finalUv = rotate(displacedUv, rotationAngle, vec2(0.6));
    
    gl_FragColor = texture2D(u_texture, mirrored(finalUv));
}