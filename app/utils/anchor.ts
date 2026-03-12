import { computed, useSlots } from 'vue';
import Slugger from 'github-slugger';

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

    const scrollToAnchor = () => {
        const element = document.getElementById(slug.value);
        if (element) {
            const headerHeight = document.querySelector('header')?.clientHeight || 0;
            window.scrollTo({
                top: element.offsetTop - headerHeight,
                behavior: 'smooth' as ScrollBehavior
            });
        }
    };

    return {
        slug,
        scrollToAnchor
    };
}