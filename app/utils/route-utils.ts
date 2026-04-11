/**
 * Utility functions for route parsing and path resolution
 */

/**
 * Extracts the slug from a route path.
 * Assumes the path format is /articles/[slug] or similar.
 * Returns the path segments after the first segment (typically 'articles').
 *
 * @param path - The current route path
 * @returns The slug portion of the path (e.g., "260311-immc-reflection" from "/articles/260311-immc-reflection")
 */
export function getSlugFromPath(path: string): string {
    const pathSegments = path.split('/').filter(Boolean);
    // Safety check: ensure we don't slice an empty array
    return pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '';
}

/**
 * Resolves an asset source path relative to the current route.
 * Used for resolving local assets in Markdown content.
 *
 * @param src - The source path (e.g., "image.jpg" or "/absolute/path.jpg")
 * @param currentPath - The current route path
 * @param absolute - Whether the src is an absolute path
 * @returns The resolved asset path
 */
export function resolveAssetSrc(src: string, currentPath: string, absolute: boolean = false): string {
if (absolute) return src;

    const safePath = currentPath || '';
    const slug = getSlugFromPath(safePath);
    const tail = src.replace(/^\/+/, "");

    return `/assets/${slug}/${tail}`;
}
