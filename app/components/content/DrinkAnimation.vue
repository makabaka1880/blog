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

// Queue-based frame loading with controlled concurrency
interface LoadTask {
    index: number;
    url: string;
    targetIndex: number;
    targetArray: THREE.Group[];
    material: THREE.Material;
}

let loadQueue: LoadTask[] = [];
let activeLoads = 0;
const MAX_CONCURRENT_LOADS = 4; // Control concurrent network requests

function enqueueLoadTask(task: LoadTask) {
    loadQueue.push(task);
    processLoadQueue();
}

async function processLoadQueue() {
    while (loadQueue.length > 0 && activeLoads < MAX_CONCURRENT_LOADS) {
        const task = loadQueue.shift();
        if (task) {
            activeLoads++;
            loadFrame(task, task.material).finally(() => {
                activeLoads--;
                processLoadQueue();
            });
        }
    }
}

async function loadFrame(task: LoadTask, material: THREE.Material) {
    try {
        const obj = await loadOBJ(task.url);
        applyMaterialToGroup(obj, material);
        obj.visible = false;
        scene.add(obj);
        task.targetArray[task.targetIndex] = obj;
    } catch (e) {
        console.warn(`Failed to load frame ${task.index}`, e);
    }
}

function preloadFramesProgressive(
    start: number,
    count: number,
    pathPrefix: string,
    material: THREE.Material,
    targetArray: THREE.Group[]
) {
    for (let i = 0; i < count; i++) {
        const index = start + i;
        const indexStr = index.toString().padStart(4, '0');
        enqueueLoadTask({
            index,
            url: `${pathPrefix}${indexStr}.obj`,
            targetIndex: i,
            targetArray,
            material
        });
    }
}


// Frame update based on elapsed time
function updateFrame(elapsedTime: number) {
    const allFrames = [...mainFrames, ...loopFrames];
    const loopStart = FRAME_COUNT_MAIN;
    const loopEnd = FRAME_COUNT_MAIN + FRAME_COUNT_LOOP - 1;

    // find highest loaded index
    let newestLoaded = -1;
    for (let i = 0; i < allFrames.length; i++) {
        if (allFrames[i]) newestLoaded = i;
    }
    if (newestLoaded < 0) return;

    // Calculate current frame based on elapsed time (24 FPS)
    const targetFPS = 24;
    const targetFrame = Math.floor(elapsedTime / (1000 / targetFPS));

    // Hide previous frame
    if (lastShownFrame >= 0 && allFrames[lastShownFrame]) {
        allFrames[lastShownFrame]!.visible = false;
    }

    // Determine which frame to show
    let frameToShow: number;

    if (!inLoop) {
        // Main sequence
        if (targetFrame < loopStart) {
            frameToShow = Math.min(targetFrame, newestLoaded);
        } else if (newestLoaded >= loopStart) {
            // Enter loop
            inLoop = true;
            frameToShow = loopStart;
        } else {
            // Hold at last loaded frame
            frameToShow = newestLoaded;
        }
    } else {
        // Loop sequence
        const loopFrame = targetFrame - loopStart;
        frameToShow = loopStart + (loopFrame % FRAME_COUNT_LOOP);
    }

    // Show the frame if it's loaded
    if (allFrames[frameToShow]) {
        allFrames[frameToShow]!.visible = true;
        lastShownFrame = frameToShow;
    } else {
        // Show last available frame if target not loaded yet
        if (lastShownFrame >= 0 && allFrames[lastShownFrame]) {
            allFrames[lastShownFrame]!.visible = true;
        }
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
        opacity: 0.9, // more transparent cup
        side: THREE.DoubleSide,
        reflectivity: 0.5,
        clearcoat: .2,
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

    // Frame material for animation frames
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

    // Load main frames progressively using queue
    preloadFramesProgressive(1, FRAME_COUNT_MAIN, FRAME_PATH_MAIN, frameMaterial, mainFrames);

    // Load loop frames progressively using queue
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

        // Initialize animation start time on first frame
        if (!isAnimationRunning) {
            isAnimationRunning = true;
            animationStartTime = time;
            return;
        }

        const elapsedTime = time - animationStartTime;

        // Render at target FPS
        if (time - lastRenderTime >= frameInterval) {
            lastRenderTime = time;

            updateFrame(elapsedTime);

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
