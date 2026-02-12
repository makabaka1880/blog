import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function useElementMouse(elementRef: Ref<HTMLElement | null>) {
    const mouseX = ref(0);
    const mouseY = ref(0);
    const mouseAvailable = ref(true);

    const handleMouseMove = (e: MouseEvent) => {
        const el = elementRef.value;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const halfX = rect.width / 2;
        const halfY = rect.height / 2;

        // Normalize mouse position relative to element center (-1 to 1)
        mouseX.value = (e.clientX - (rect.left + halfX)) / halfX;
        mouseY.value = (e.clientY - (rect.top + halfY)) / halfY;
    };

    onMounted(() => {
        // Check if mouse is available (hover: hover and pointer: fine)
        const media = window.matchMedia('(hover: hover) and (pointer: fine)');
        mouseAvailable.value = media.matches;

        if (!mouseAvailable.value) {
            console.warn('Mouse tracking is not available on this device (touch-only or coarse pointer)');
        }

        window.addEventListener('mousemove', handleMouseMove);
    });

    onUnmounted(() => {
        window.removeEventListener('mousemove', handleMouseMove);
    });

    return { mouseX, mouseY, mouseAvailable };
}