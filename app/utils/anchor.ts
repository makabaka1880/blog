import { computed, useSlots } from 'vue';
import Slugger from 'github-slugger';

export const scrollToId = (id: string, offset: number = 120): void => {
    const targetId = id.startsWith('#') ? id.substring(1) : id;
    const element = document.getElementById(targetId);

    if (element) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.clientHeight : 0;

        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Update the URL hash without triggering a browser jump
        history.pushState(null, '', `#${targetId}`);
    } else {
        console.warn(`[scrollToId] Element with id "${targetId}" not found.`);
    }
};

/**
 * Composable function that provides anchor functionality for heading components
 * Returns slug and scrollToAnchor function
 */
export function useAnchor() {
    const slots = useSlots();
    const slugs = new Slugger();

    function convertToSlug(text: string) {
        return slugs.slug(text).replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .replace(/^(\d)/, '_$1')
    }

    const title = computed(() => {
        if (slots.default) {
            const vnodes = slots.default();
            let text = '';
            vnodes.forEach(vnode => {
                if (vnode.children) {
                    text += String(vnode.children);
                }
            });
            return text;
        }
        return '';
    });

    const slug = computed(() => convertToSlug(title.value));

    const scrollToAnchor = (): void => {
        if (slug.value) {
            scrollToId(slug.value);
        }
    };

    return {
        slug,
        scrollToAnchor
    };
}