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

vec2 getDisplacedUv(vec2 baseUv,vec2 view){
    vec3 viewDir=normalize(vec3(view,1.));
    
    float minLayers=8.;
    float maxLayers=32.;
    
    float brightness=abs(dot(vec3(0.,0.,1.),viewDir));
    float numLayers=mix(maxLayers,minLayers,brightness);
    
    float layerStep=1./numLayers;
    
    float heightScale=.1;
    vec2 deltaUV=view*heightScale/numLayers;
    
    float currentLayerHeight=1.;
    vec2 currentUV=baseUv;
    float mapHeight=texture2D(u_depth,currentUV).r;
    
    for(int i=0;i<32;i++){// Using constant for loop limit
        if(currentLayerHeight<=mapHeight||i>=int(numLayers))break;
        
        currentLayerHeight-=layerStep;
        currentUV+=deltaUV;
        mapHeight=texture2D(u_depth,currentUV).r;
    }
    
    vec2 lastDeltaUV=deltaUV;
    float lastLayerStep=layerStep;
    
    for(int j=0;j<5;j++){
        lastDeltaUV/=2.;
        lastLayerStep/=2.;
        
        if(mapHeight>currentLayerHeight){
            currentUV-=lastDeltaUV;
            currentLayerHeight+=lastLayerStep;
        }else{
            currentUV+=lastDeltaUV;
            currentLayerHeight-=lastLayerStep;
        }
        mapHeight=texture2D(u_depth,currentUV).r;
    }
    
    return currentUV;
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
    
    float sensitivity=.002;
    float displaced=-(u_offset-800.)*sensitivity;
    
    // Chromatic Aberration
    float aberrationAmount=max((-.1-displaced)*.1,0.);
    
    vec2 pivot=vec2(.6);
    
    vec2 uvG=getDisplacedUv(baseUv,vec2(0.,displaced));
    vec2 uvR=getDisplacedUv(baseUv,vec2(0.,displaced+aberrationAmount));
    vec2 uvB=getDisplacedUv(baseUv,vec2(0.,displaced-aberrationAmount));
    
    float rotationAngle=displaced*0.02;
    
    vec2 finalUvR=rotate(uvR,rotationAngle,pivot);
    vec2 finalUvG=rotate(uvG,rotationAngle,pivot);
    vec2 finalUvB=rotate(uvB,rotationAngle,pivot);
    
    float r=texture2D(u_texture,mirrored(finalUvR)).r;
    float g=texture2D(u_texture,mirrored(finalUvG)).g;
    float b=texture2D(u_texture,mirrored(finalUvB)).b;
    
    gl_FragColor=vec4(r,g,b,1.);
}