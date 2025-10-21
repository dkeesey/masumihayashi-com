/**
 * PhotoSwipe Initialization Script
 *
 * Configures PhotoSwipe v5 for artwork zoom functionality.
 * Handles full-screen lightbox, pinch-zoom, progressive image loading,
 * and custom caption display.
 *
 * Features:
 * - Mobile gestures: pinch-zoom, double-tap, swipe-to-close
 * - Desktop: Click to zoom, scroll/mousewheel to zoom in/out
 * - Keyboard: ESC to close, arrows for gallery navigation
 * - Progressive loading: Shows lower-res while high-res loads
 * - Custom caption overlay from figcaption elements
 */

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import type { PhotoSwipeOptions } from 'photoswipe';

// Initialize PhotoSwipe lightbox
const lightbox = new PhotoSwipeLightbox({
  // Gallery selector
  gallery: 'body',
  children: 'a.zoom-trigger',
  pswpModule: PhotoSwipe,

  // Zoom animation
  showHideAnimationType: 'zoom',

  // Zoom levels
  maxZoomLevel: 4,           // Maximum zoom (4x = 400%)
  secondaryZoomLevel: 2,     // Double-tap/click zoom level
  initialZoomLevel: 'fit',   // Start with image fitted to viewport

  // Padding (space around image edges when zoomed)
  padding: { top: 20, bottom: 80, left: 20, right: 20 },

  // Mobile gestures
  pinchToClose: false,       // Don't close on pinch-out (allow zoom out)
  closeOnVerticalDrag: true, // Swipe down to close
  verticalDragToClose: true, // Enable vertical drag

  // Background
  bgOpacity: 0.95,

  // Preload adjacent images for gallery navigation
  preload: [1, 2],

  // Enable wheel-to-zoom on desktop
  wheelToZoom: true,

  // Image loading
  preloadFirstSlide: true,

  // Allow right-click
  allowPanToNext: false, // Disable accidental swipe to next

  // Accessibility
  ariaLabel: 'Image lightbox',
  closeTitle: 'Close (Esc)',
  zoomTitle: 'Zoom in',

  // Error handling
  errorMsg: 'The image could not be loaded',
} as Partial<PhotoSwipeOptions>);

/**
 * Add custom artwork caption overlay
 * Extracts caption from figcaption element and displays in lightbox
 */
lightbox.on('uiRegister', () => {
  lightbox.pswp?.ui?.registerElement({
    name: 'artwork-caption',
    order: 9,
    isButton: false,
    appendTo: 'root',
    html: '',
    onInit: (el: HTMLElement, pswp: PhotoSwipe) => {
      // Update caption when slide changes
      lightbox.pswp?.on('change', () => {
        const currSlide = lightbox.pswp?.currSlide;
        if (!currSlide?.data?.element) return;

        const slideElement = currSlide.data.element as HTMLElement;

        // Find figcaption sibling
        const parent = slideElement.closest('[data-artwork-id]');
        const caption = parent?.querySelector('[data-caption]');

        if (caption) {
          el.innerHTML = caption.innerHTML;
          el.style.display = 'block';
        } else {
          // Fallback to alt text
          const img = slideElement.querySelector('img');
          if (img?.alt) {
            el.innerHTML = `<em>${img.alt}</em>`;
            el.style.display = 'block';
          } else {
            el.style.display = 'none';
          }
        }
      });
    }
  });
});

/**
 * Handle keyboard shortcuts
 */
lightbox.on('bindEvents', () => {
  const pswp = lightbox.pswp;
  if (!pswp) return;

  // Add custom keyboard handlers
  pswp.on('keydown', (e: any) => {
    if (e.originalEvent?.key === 'Escape' || e.originalEvent?.key === 'Esc') {
      pswp.close();
    }
  });
});

/**
 * Track zoom state for analytics (optional)
 */
lightbox.on('initialZoomInEnd', () => {
  // Optional: Send analytics event
  console.log('Image zoomed:', lightbox.pswp?.currSlide?.data?.element?.getAttribute('href'));
});

// Initialize the lightbox
lightbox.init();

// Export for potential cleanup/reinitialization
export { lightbox };
