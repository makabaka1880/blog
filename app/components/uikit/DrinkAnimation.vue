<template>
    <div id="threejs-canvas"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { TextureLoader, ShaderMaterial } from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass';
import { RenderPass } from 'three/addons/postprocessing/RenderPass';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const FRAME_COUNT_MAIN = 100;
const FRAME_COUNT_LOOP = 40;
const FRAME_PATH_MAIN = '/assets/drink-baked/blog';
const FRAME_PATH_LOOP = '/assets/drink-baked/blog';

// Separate OBJs for stationary objects
const CUP_OBJ = '/assets/cup.obj';
const LEMON_OBJ = '/assets/lemon.obj';

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let currentFrame = 0;
let mainFrames: THREE.Group[] = [];
let loopFrames: THREE.Group[] = [];
let cupMesh: THREE.Group | null = null;
let lemonMesh: THREE.Group | null = null;

const loader = new OBJLoader();
// Load a single OBJ
function loadOBJ(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
}

// Apply material recursively to all meshes in a group
function applyMaterialToGroup(group: THREE.Group, material: THREE.Material) {
    group.traverse((child: any) => {
        if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = material;
        }
    });
}

// Preload animated frames with a given material
async function preloadFrames(
    start: number,
    count: number,
    pathPrefix: string,
    material: THREE.Material
): Promise<THREE.Group[]> {
    const frames: THREE.Group[] = [];
    for (let i = 0; i < count; i++) {
        const index = (start + i).toString().padStart(4, '0');
        const obj = await loadOBJ(`${pathPrefix}${index}.obj`);
        applyMaterialToGroup(obj, material);
        obj.visible = false;
        frames.push(obj);
        scene.add(obj);
    }
    return frames;
}

// Frame update
function updateFrame() {
    const allFrames = [...mainFrames, ...loopFrames];
    allFrames.forEach((f, idx) => (f.visible = idx === currentFrame));

    currentFrame++;
    if (currentFrame >= mainFrames.length + loopFrames.length) {
        currentFrame = mainFrames.length; // loop
    }
}

// Animation loop

onMounted(async () => {
    // Scene & camera
    scene = new THREE.Scene();
    const container = document.getElementById("threejs-canvas")!;
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, -15);
    camera.rotation.set(0, Math.PI, 0)

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,   // basic MSAA
        alpha: true
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    // Orbit controls for mouse interaction
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;

    const composer = new EffectComposer(renderer);

    // Materials
    const cupGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1.0,
        transparent: true,
        opacity: 0.6, // more transparent cup
        side: THREE.DoubleSide,
        reflectivity: 0.5,
        clearcoat: .9,
        clearcoatRoughness: 0.1,
        depthWrite: false
    });


    // Load stationary objects
    cupMesh = await loadOBJ(CUP_OBJ);
    applyMaterialToGroup(cupMesh, cupGlassMaterial);
    scene.add(cupMesh);

    lemonMesh = await loadOBJ(LEMON_OBJ);
    const lemonTexture = new TextureLoader().load('/assets/lemon-diffuse.png');
    const lemonMaterial = new THREE.MeshPhysicalMaterial({
        map: lemonTexture, // assign the texture here
        color: 0xffffff,   // base color multiplies texture
        metalness: 0,
        roughness: 0.2,
        transmission: 0.0,
        transparent: false,
        side: THREE.DoubleSide
    });
    applyMaterialToGroup(lemonMesh, lemonMaterial);
    scene.add(lemonMesh);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-6, 5, -3);
    scene.add(light);


    // Preload animation frames (optional, using glassMaterial for now)
    const frameMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1.0,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        reflectivity: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    mainFrames = await preloadFrames(1, FRAME_COUNT_MAIN, FRAME_PATH_MAIN, frameMaterial);
    loopFrames = await preloadFrames(101, FRAME_COUNT_LOOP, FRAME_PATH_LOOP, frameMaterial);

    const colorRampFrag = await (await fetch('/assets/shaders/color-ramp.glsl')).text();
    const rampTexture = new TextureLoader().load('/assets/ramp.png');
    rampTexture.minFilter = THREE.LinearFilter;
    rampTexture.magFilter = THREE.LinearFilter;
    rampTexture.wrapS = THREE.ClampToEdgeWrapping;
    rampTexture.wrapT = THREE.ClampToEdgeWrapping;


    const colorRampPass = new ShaderPass(
        new ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                uRamp: { value: rampTexture }
            },
            vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
                `,
            fragmentShader: colorRampFrag
        })
    );
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(colorRampPass);

    // Start animation
    let lastFrameTime = 0;
    const targetFPS = 24; // your fixed framerate
    const frameInterval = 1000 / targetFPS; // milliseconds per frame

    function animate(time: number) {
        requestAnimationFrame(animate);

        // time is passed by requestAnimationFrame in ms
        if (time - lastFrameTime >= frameInterval) {
            lastFrameTime = time;

            updateFrame();

            controls.update();

            // Use composer if you have post-processing
            composer.render();

            // Or plain renderer if not
            // renderer.render(scene, camera);
        }
    }

    requestAnimationFrame(animate);
});
</script>

<style lang="scss" scoped>
#threejs-canvas {
    width: 100%;
    min-height: 600px;

    :deep(canvas) {
        mix-blend-mode: darken;
        display: block;
    }
}
</style>
