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

let lastShownFrame = -1;
let playbackStarted = false;
let loadStartTime = performance.now();

const MIN_READY_FRAMES = 4;
const FORCE_START_MS = 1200;


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
let animationStartTime: number = 0;
let isAnimationRunning = false;
let inLoop = false;


const loader = new OBJLoader();
// Load a single OBJ
function loadOBJ(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
}

function loadedCount(): number {
    return [...mainFrames, ...loopFrames].filter(f => f).length;
}

// Apply material recursively to all meshes in a group
function applyMaterialToGroup(group: THREE.Group, material: THREE.Material) {
    group.traverse((child: any) => {
        if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = material;
        }
    });
}

// Progressive frame loading - loads frames in parallel but notifies as each completes
async function preloadFramesProgressive(
    start: number,
    count: number,
    pathPrefix: string,
    material: THREE.Material,
    targetArray: THREE.Group[]
) {
    for (let i = 0; i < count; i++) {
        const indexStr = (start + i).toString().padStart(4, '0');

        try {
            const obj = await loadOBJ(`${pathPrefix}${indexStr}.obj`);
            applyMaterialToGroup(obj, material);
            obj.visible = false;
            scene.add(obj);
            targetArray[i] = obj;
        } catch (e) {
            console.warn(`Failed to load frame ${indexStr}`, e);
        }
    }
}


// Frame update based on elapsed time
function updateFrame() {
    const allFrames = [...mainFrames, ...loopFrames];
    const loopStart = FRAME_COUNT_MAIN;
    const loopEnd = FRAME_COUNT_MAIN + FRAME_COUNT_LOOP - 1;

    // find highest loaded index
    let newestLoaded = -1;
    for (let i = 0; i < allFrames.length; i++) {
        if (allFrames[i]) newestLoaded = i;
    }
    if (newestLoaded < 0) return;

    // start playback
    if (!playbackStarted) {
        playbackStarted = true;
        lastShownFrame = Math.min(newestLoaded, 0);
    }

    // hide previous
    if (lastShownFrame >= 0 && allFrames[lastShownFrame]) {
        allFrames[lastShownFrame]!.visible = false;
    }

    let next = lastShownFrame + 1;

    // ---- MAIN → LOOP TRANSITION ----
    if (!inLoop) {
        // still in main section
        if (next <= newestLoaded && next < loopStart) {
            allFrames[next]!.visible = true;
            lastShownFrame = next;
            return;
        }

        // enter loop
        if (newestLoaded >= loopStart) {
            inLoop = true;
            next = loopStart;
        } else {
            // main not fully loaded yet → hold
            allFrames[lastShownFrame]!.visible = true;
            return;
        }
    }

    // ---- LOOP PHASE ----
    if (inLoop) {
        if (next > loopEnd || !allFrames[next]) {
            next = loopStart;
        }

        allFrames[next]!.visible = true;
        lastShownFrame = next;
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


    // Preload animation frames progressively
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

    // Initialize arrays with placeholders
    mainFrames = new Array(FRAME_COUNT_MAIN);
    loopFrames = new Array(FRAME_COUNT_LOOP);

    // Start progressive loading - don't await, let it load in background
    animationStartTime = performance.now();
    isAnimationRunning = true;

    // Load main frames progressively
    preloadFramesProgressive(1, FRAME_COUNT_MAIN, FRAME_PATH_MAIN, frameMaterial, mainFrames);

    // Load loop frames progressively
    preloadFramesProgressive(101, FRAME_COUNT_LOOP, FRAME_PATH_LOOP, frameMaterial, loopFrames);

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
    const targetFPS = 24;
    const frameInterval = 1000 / targetFPS;
    let lastRenderTime = 0;

    function animate(time: number) {
        requestAnimationFrame(animate);

        if (!isAnimationRunning) return;

        const elapsedTime = time - animationStartTime;

        // Render at target FPS
        if (time - lastRenderTime >= frameInterval) {
            lastRenderTime = time;

            updateFrame();

            controls.update();
            composer.render();
        }
    }

    requestAnimationFrame(animate);
});
</script>

<style lang="scss" scoped>
#threejs-canvas {
    min-height: 600px;
    pointer-events: auto;

    :deep(canvas) {
        display: block;
        pointer-events: auto;
    }
}
</style>
