uniform sampler2D tDiffuse;
uniform sampler2D uRamp;
varying vec2 vUv;

void main(){
    vec4 color=texture2D(tDiffuse,vUv);
    
    float brightness=dot(color.rgb,vec3(.299,.587,.114));
    
    // sample the ramp texture (assumes horizontal gradient)
    vec4 rampColor=texture2D(uRamp,vec2(brightness,1));
    
    gl_FragColor=vec4(rampColor.rgb,color.a);
}
