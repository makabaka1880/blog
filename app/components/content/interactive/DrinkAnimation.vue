<template>
    <div id="threejs-canvas"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { TextureLoader, ShaderMaterial } from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass';
import { RenderPass } from 'three/addons/postprocessing/RenderPass';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { eventBus, type DrinkEventType } from '~/composables/useDrinkEvents';

// ==================== CONSTANTS ====================
const ANIMATION_CONFIG = {
    FRAME_COUNT_MAIN: 100,
    FRAME_COUNT_LOOP: 40,
    FRAME_PATH_MAIN: '/assets/drink-baked/blog',
    FRAME_PATH_LOOP: '/assets/drink-baked/blog',
    TARGET_FPS: 15,
    MIN_READY_FRAMES: 4,
    FORCE_START_MS: 1200,
    MAX_CONCURRENT_LOADS: 4,
} as const;

const ASSET_PATHS = {
    CUP: '/assets/cup.obj',
    LEMON: '/assets/lemon.obj',
    LEMON_DIFFUSE: '/assets/lemon-diffuse.png',
    COLOR_RAMP_SHADER: '/assets/shaders/color-ramp.glsl',
    RAMP_TEXTURE: '/assets/ramp.png',
} as const;

const CAMERA_CONFIG = {
    FOV: 45,
    NEAR: 0.1,
    FAR: 1000,
    POSITION: { x: 0, y: 5, z: -12 },
} as const;

const WOBBLE_CONFIG = {
    DURATION: 500,      // Wobble duration in ms
    AMPLITUDE: 5,     // Maximum wobble displacement
    PERIOD_X: 20,        // Number of complete oscillation cycles for X axis
    PERIOD_Y: 1,        // Number of complete oscillation cycles for Y axis
    AMPLITUDE_RATIO_Y: 0.5,  // Y axis amplitude as ratio of X amplitude
    OSCILLATION_CYCLES: 2,   // Number of oscillation cycles for decay envelope
} as const;

// ==================== STATE ====================
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let composer: EffectComposer;

let mainFrames: THREE.Group[] = [];
let loopFrames: THREE.Group[] = [];
let cupMesh: THREE.Group | null = null;
let lemonMesh: THREE.Group | null = null;

let animationStartTime: number = 0;
let isAnimationRunning = false;
let inLoop = false;
let lastShownFrame = -1;
let lastRenderTime = 0;

// Frame loading queue state
let loadQueue: LoadTask[] = [];
let activeLoads = 0;

// Camera wobble state
let isWobbling = false;
let wobbleStartTime = 0;
let originalCameraPos: THREE.Vector3;
let originalTarget: THREE.Vector3;

// Event listener unsubscribe function
let unsubscribeHintClick: (() => void) | null = null;

// ==================== TYPES ====================
interface LoadTask {
    index: number;
    url: string;
    targetIndex: number;
    targetArray: THREE.Group[];
    material: THREE.Material;
}

// ==================== THREE.JS SETUP ====================
function initScene(): THREE.Scene {
    return new THREE.Scene();
}

function initCamera(container: HTMLElement): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
        CAMERA_CONFIG.FOV,
        container.clientWidth / container.clientHeight,
        CAMERA_CONFIG.NEAR,
        CAMERA_CONFIG.FAR
    );
    camera.position.set(CAMERA_CONFIG.POSITION.x, CAMERA_CONFIG.POSITION.y, CAMERA_CONFIG.POSITION.z);
    return camera;
}

function initRenderer(container: HTMLElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    return renderer;
}

function initControls(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement): OrbitControls {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.target.set(0, 2, 0);
    return controls;
}

// ==================== CAMERA WOBBLE ====================
function triggerCameraWobble(): void {
    if (isWobbling) return;
    
    isWobbling = true;
    wobbleStartTime = performance.now();
    originalCameraPos = camera.position.clone();
    originalTarget = controls.target.clone();
}

function updateCameraWobble(currentTime: number): void {
    if (!isWobbling) return;
    
    const elapsed = currentTime - wobbleStartTime;
    
    if (elapsed >= WOBBLE_CONFIG.DURATION) {
        // Wobble complete, restore original position
        camera.position.copy(originalCameraPos);
        controls.target.copy(originalTarget);
        isWobbling = false;
        return;
    }
    
    // Wobble animation using sine wave
    const progress = elapsed / WOBBLE_CONFIG.DURATION;
    const decayEnvelope = Math.sin(progress * Math.PI * WOBBLE_CONFIG.OSCILLATION_CYCLES) * (1 - progress);
    const wobbleAmount = WOBBLE_CONFIG.AMPLITUDE * decayEnvelope;
    
    camera.position.x = originalCameraPos.x + Math.sin(progress * Math.PI * WOBBLE_CONFIG.PERIOD_X) * wobbleAmount;
    camera.position.y = originalCameraPos.y + Math.cos(progress * Math.PI * WOBBLE_CONFIG.PERIOD_Y) * wobbleAmount * WOBBLE_CONFIG.AMPLITUDE_RATIO_Y;
}

// ==================== MATERIALS ====================
function createCupMaterial(): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1.0,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        reflectivity: 0.5,
        clearcoat: 0.2,
        clearcoatRoughness: 0.1,
        depthWrite: false,
    });
}

function createLemonMaterial(texture: THREE.Texture): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
        map: texture,
        color: 0xffffff,
        metalness: 0,
        roughness: 0.2,
        transmission: 0.0,
        transparent: false,
        side: THREE.DoubleSide,
    });
}

function createFrameMaterial(): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1.0,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        reflectivity: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });
}

// ==================== OBJ LOADING ====================
const loader = new OBJLoader();

function loadOBJ(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
}

function applyMaterialToGroup(group: THREE.Group, material: THREE.Material): void {
    group.traverse((child: any) => {
        if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = material;
        }
    });
}

async function loadCup(material: THREE.Material): Promise<THREE.Group> {
    const mesh = await loadOBJ(ASSET_PATHS.CUP);
    applyMaterialToGroup(mesh, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    return mesh;
}

async function loadLemon(): Promise<THREE.Group> {
    const texture = new TextureLoader().load(ASSET_PATHS.LEMON_DIFFUSE);
    const material = createLemonMaterial(texture);
    const mesh = await loadOBJ(ASSET_PATHS.LEMON);
    applyMaterialToGroup(mesh, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    return mesh;
}

// ==================== FRAME LOADING QUEUE ====================
function enqueueLoadTask(task: LoadTask): void {
    loadQueue.push(task);
    processLoadQueue();
}

async function processLoadQueue(): Promise<void> {
    while (loadQueue.length > 0 && activeLoads < ANIMATION_CONFIG.MAX_CONCURRENT_LOADS) {
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

async function loadFrame(task: LoadTask, material: THREE.Material): Promise<void> {
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
): void {
    for (let i = 0; i < count; i++) {
        const index = start + i;
        const indexStr = index.toString().padStart(4, '0');
        enqueueLoadTask({
            index,
            url: `${pathPrefix}${indexStr}.obj`,
            targetIndex: i,
            targetArray,
            material,
        });
    }
}

// ==================== ANIMATION ====================
function updateFrame(elapsedTime: number): void {
    const allFrames = [...mainFrames, ...loopFrames];
    const loopStart = ANIMATION_CONFIG.FRAME_COUNT_MAIN;

    // Find highest loaded index
    let newestLoaded = -1;
    for (let i = 0; i < allFrames.length; i++) {
        if (allFrames[i]) newestLoaded = i;
    }
    if (newestLoaded < 0) return;

    // Calculate current frame based on elapsed time
    const targetFrame = Math.floor(elapsedTime / (1000 / ANIMATION_CONFIG.TARGET_FPS));

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
            inLoop = true;
            frameToShow = loopStart;
        } else {
            frameToShow = newestLoaded;
        }
    } else {
        // Loop sequence
        const loopFrame = targetFrame - loopStart;
        frameToShow = loopStart + (loopFrame % ANIMATION_CONFIG.FRAME_COUNT_LOOP);
    }

    // Show the frame if it's loaded
    if (allFrames[frameToShow]) {
        allFrames[frameToShow]!.visible = true;
        lastShownFrame = frameToShow;
    } else if (lastShownFrame >= 0 && allFrames[lastShownFrame]) {
        // Show last available frame if target not loaded yet
        allFrames[lastShownFrame]!.visible = true;
    }
}

function animate(time: number): void {
    requestAnimationFrame(animate);

    // Initialize animation start time on first frame
    if (!isAnimationRunning) {
        isAnimationRunning = true;
        animationStartTime = time;
        return;
    }

    const elapsedTime = time - animationStartTime;
    const frameInterval = 1000 / ANIMATION_CONFIG.TARGET_FPS;

    // Render at target FPS
    if (time - lastRenderTime >= frameInterval) {
        lastRenderTime = time;
        updateFrame(elapsedTime);
        updateCameraWobble(time);
        controls.update();
        composer.render();
    }
}

// ==================== POST-PROCESSING ====================
async function initPostProcessing(): Promise<EffectComposer> {
    const composer = new EffectComposer(renderer);

    // Load color ramp shader
    const colorRampFrag = await (await fetch(ASSET_PATHS.COLOR_RAMP_SHADER)).text();
    const rampTexture = new TextureLoader().load(ASSET_PATHS.RAMP_TEXTURE);
    rampTexture.minFilter = THREE.LinearFilter;
    rampTexture.magFilter = THREE.LinearFilter;
    rampTexture.wrapS = THREE.ClampToEdgeWrapping;
    rampTexture.wrapT = THREE.ClampToEdgeWrapping;

    const colorRampPass = new ShaderPass(
        new ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                uRamp: { value: rampTexture },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: colorRampFrag,
        })
    );

    const renderPass = new RenderPass(scene, camera);

    composer.addPass(renderPass);
    composer.addPass(colorRampPass);
    return composer;
}

// ==================== INITIALIZATION ====================
async function setupScene(): Promise<void> {
    const container = document.getElementById("threejs-canvas")!;

    scene = initScene();
    camera = initCamera(container);
    renderer = initRenderer(container);
    controls = initControls(camera, renderer.domElement);
    composer = await initPostProcessing();

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-6, 5, -3);
    scene.add(light);

    // Load static objects
    const cupMaterial = createCupMaterial();
    cupMesh = await loadCup(cupMaterial);
    lemonMesh = await loadLemon();

    // Setup animation frames
    mainFrames = new Array(ANIMATION_CONFIG.FRAME_COUNT_MAIN);
    loopFrames = new Array(ANIMATION_CONFIG.FRAME_COUNT_LOOP);
    const frameMaterial = createFrameMaterial();

    preloadFramesProgressive(
        1,
        ANIMATION_CONFIG.FRAME_COUNT_MAIN,
        ANIMATION_CONFIG.FRAME_PATH_MAIN,
        frameMaterial,
        mainFrames
    );
    preloadFramesProgressive(
        101,
        ANIMATION_CONFIG.FRAME_COUNT_LOOP,
        ANIMATION_CONFIG.FRAME_PATH_LOOP,
        frameMaterial,
        loopFrames
    );

    // Listen for hint-click event
    unsubscribeHintClick = eventBus.on('hint-click' as DrinkEventType, () => {
        triggerCameraWobble();
    });

    // Start animation loop
    requestAnimationFrame(animate);
}

onMounted(setupScene);

onBeforeUnmount(() => {
    if (unsubscribeHintClick) {
        unsubscribeHintClick();
    }
});
</script>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

#threejs-canvas {
    min-height: 37.5rem;
    pointer-events: auto;

    :deep(canvas) {
        display: block;
        pointer-events: auto;
        filter: hue-rotate(var(--color-hue, 200deg));
    }
}
</style>
