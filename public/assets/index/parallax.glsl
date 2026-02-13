precision mediump float;

uniform sampler2D u_texture;
uniform sampler2D u_depth;
uniform vec2 u_resolution;
uniform vec2 u_imageRes;
uniform float u_offset;

varying vec2 v_uv;

// Rotation helper function
vec2 rotate(vec2 v,float angle,vec2 pivot){
    float s=sin(angle);
    float c=cos(angle);
    mat2 m=mat2(c,-s,s,c);
    return m*(v-pivot)+pivot;
}

vec2 getImageUv(vec2 screenUv){
    float imageAspect=u_imageRes.x/u_imageRes.y;
    float canvasAspect=u_resolution.x/u_resolution.y;
    float horizontalScale=canvasAspect/imageAspect;
    float shiftFactor=1.-horizontalScale;
    float alignmentOffset=shiftFactor*.15;
    
    return vec2(
        (screenUv.x*horizontalScale)+alignmentOffset,
        1.-screenUv.y
    );
}

// We remove the pre-sampled depthData and use the texture inside the loop
vec2 getDisplacedUv(vec2 baseUv,vec2 view){
    const int layers=16;
    float layerStep=1./float(layers);
    
    // How much to shift UVs per layer step
    vec2 deltaUV=view/float(layers);
    
    float currentLayerHeight=1.;// Start at the "top"
    vec2 currentUV=baseUv;
    float mapHeight=texture2D(u_depth,currentUV).r;
    
    // We need to store the previous state for the interpolation at the end
    float prevLayerHeight=currentLayerHeight;
    float prevMapHeight=mapHeight;
    
    for(int i=0;i<layers;i++){
        // Break when our ray goes "below" the heightmap value
        if(currentLayerHeight<mapHeight)break;
        
        // Keep track of the "before hit" state
        prevLayerHeight=currentLayerHeight;
        prevMapHeight=mapHeight;
        
        // March deeper
        currentLayerHeight-=layerStep;
        currentUV+=deltaUV;
        mapHeight=texture2D(u_depth,currentUV).r;
    }
    
    // --- Linear Interpolation (Smoothing) ---
    // This calculates exactly where the ray pierced the surface between steps
    float nextHeight=prevLayerHeight-prevMapHeight;
    float prevHeight=mapHeight-currentLayerHeight;
    float weight=nextHeight/(nextHeight+prevHeight);
    
    return mix(currentUV,currentUV-deltaUV,weight);
}

vec2 mirrored(vec2 v){
    vec2 m=mod(v,2.);
    return mix(m,2.-m,step(1.,m));
}

void main(){
    vec2 baseUv=getImageUv(v_uv);
    vec4 sampledDepth=texture2D(u_depth,baseUv);
    
    float depth=sampledDepth.r;
    float delineatedDepth=depth;
    vec4 enhancedDepth=vec4(vec3(delineatedDepth),1.);
    
    float sensitivity=.0004;
    float displaced=-(u_offset-550.)*sensitivity;
    
    // Chromatic Aberration
    float aberrationAmount=max((-.1-displaced)*.1,0.);
    
    vec2 pivot=vec2(.6);
    
    vec2 uvG=getDisplacedUv(baseUv,vec2(0.,displaced));
    vec2 uvR=getDisplacedUv(baseUv,vec2(0.,displaced+aberrationAmount));
    vec2 uvB=getDisplacedUv(baseUv,vec2(0.,displaced-aberrationAmount));
    
    float rotationAngle=displaced*.2;
    
    vec2 finalUvR=rotate(uvR,rotationAngle,pivot);
    vec2 finalUvG=rotate(uvG,rotationAngle,pivot);
    vec2 finalUvB=rotate(uvB,rotationAngle,pivot);
    
    float r=texture2D(u_texture,mirrored(finalUvR)).r;
    float g=texture2D(u_texture,mirrored(finalUvG)).g;
    float b=texture2D(u_texture,mirrored(finalUvB)).b;
    
    gl_FragColor=vec4(r,g,b,1.);
}