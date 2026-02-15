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
uniform float u_viewHeight;

const float layers=16.;
const float dh=1./layers;
varying vec2 v_uv;

void main(){
    vec2 uv_origin=vec2(v_uv.x,1.-v_uv.y);
    vec2 aspect=vec2(u_resolution.x/u_resolution.y,1.);
    vec2 total_offset=aspect*u_offset*u_sensitivity;
    
    vec2 d_offset=total_offset/layers;
    
    // Some adjustments such that uv is at baseline;
    vec2 current_uv=uv_origin-(total_offset*(1.-u_viewHeight));
    float current_ray_height=1.;
    
    float map_height=texture2D(u_depth,current_uv).r;
    vec2 prev_uv=current_uv;
    float prev_ray_height=current_ray_height;
    float prev_map_height=map_height;
    
    for(float i=0.;i<layers;i++){
        if(current_ray_height<=map_height)break;
        
        prev_uv=current_uv;
        prev_ray_height=current_ray_height;
        prev_map_height=map_height;
        
        current_ray_height-=dh;
        current_uv+=d_offset;
        map_height=texture2D(u_depth,current_uv).r;
    }
    
    float curr_diff=map_height-current_ray_height;
    float prev_diff=prev_ray_height-prev_map_height;
    float weight=curr_diff/(curr_diff+prev_diff);
    vec2 final_uv=mix(current_uv,prev_uv,weight);
    
    gl_FragColor=texture2D(u_texture,final_uv);
}