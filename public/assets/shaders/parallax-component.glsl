precision mediump float;

uniform sampler2D u_texture;
uniform sampler2D u_depth;
uniform vec2 u_resolution;// canvas size in pixels
uniform vec2 u_imageRes;// image size in pixels
uniform vec2 u_offset;
uniform vec2 u_sensitivity;
uniform vec2 u_imageScale;// x = scaleX, y = scaleY
uniform vec2 u_imageTranslate;
uniform bool u_reverseDepth;

varying vec2 v_uv;

void main(){
    vec2 uv=vec2(v_uv.x,1.-v_uv.y);
    float depth=texture2D(u_depth,uv).r;
    if (u_reverseDepth) {
        depth = 1.0 - depth;
    }
    uv-=u_offset*u_sensitivity*(depth - 0.5);
    gl_FragColor=texture2D(u_texture,uv);
}