/**
 * Infinite scroll functionality for gallery pages
 * Automatically loads next series when scrolling near bottom
 */
import { getNextSeries } from '../config/series-order';

export function initInfiniteScroll(currentSeriesSlug: string) {
  let isLoadingNext = false;
  let loadedSeries = new Set([currentSeriesSlug]);
  let artworkIndex = document.querySelectorAll('.artwork-section').length;

  // Check if we're near the bottom and should load next series
  function checkScrollPosition() {
    const container = document.querySelector('.gallery-scroll-container');
    if (!container || isLoadingNext) return;

    const sections = document.querySelectorAll('.artwork-section');
    if (sections.length === 0) return;

    // Find the second-to-last section
    const secondLastSection = sections[sections.length - 2];
    if (!secondLastSection) return;

    const rect = secondLastSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Load next series when second-to-last artwork is in viewport (2 from bottom)
    if (rect.top < viewportHeight && rect.bottom > 0) {
      loadNextSeries();
    }
  }

  async function loadNextSeries() {
    isLoadingNext = true;

    // Get the last series we loaded
    const loadedArray = Array.from(loadedSeries);
    const lastLoadedSlug = loadedArray[loadedArray.length - 1];
    const nextSeries = getNextSeries(lastLoadedSlug);

    // Prevent duplicate loading
    if (loadedSeries.has(nextSeries.slug)) {
      isLoadingNext = false;
      return;
    }

    try {
      const response = await fetch(`/api/series/${nextSeries.slug}`);
      if (!response.ok) throw new Error('Failed to fetch series');

      const data = await response.json();

      // Append artworks to gallery
      appendArtworks(data);
      loadedSeries.add(nextSeries.slug);

      console.log(`Loaded series: ${data.series} (${data.artworks.length} artworks)`);
    } catch (error) {
      console.error('Failed to load next series:', error);
    } finally {
      isLoadingNext = false;
    }
  }

  function appendArtworks(seriesData: any) {
    const container = document.querySelector('.gallery-scroll-container');
    const navigationSection = container?.querySelector('.artwork-section + div:has(> .gallery-navigation)');

    if (!container) return;

    // Get Cloudinary cloud name from env
    const cloudName = (import.meta as any).env.PUBLIC_CLOUDINARY_CLOUD_NAME;

    seriesData.artworks.forEach((artwork: any, index: number) => {
      // Create artwork section
      const section = document.createElement('section');
      section.className = 'artwork-section';
      section.dataset.artworkIndex = String(artworkIndex++);
      section.dataset.artworkSlug = artwork.slug;
      section.dataset.seriesName = seriesData.series;

      // Build location string
      const locationParts = [artwork.city, artwork.state, artwork.country].filter(Boolean);
      const locationStr = locationParts.length > 0 ? `<br />${locationParts.join(', ')}` : '';

      // Build media and size string
      const mediaStr = artwork.media ? `<br />${artwork.media}` : '';
      const sizeStr = artwork.size ? `, ${artwork.size}` : '';

      section.innerHTML = `
        <div class="w-full px-4 flex justify-center">
          <button
            class="artwork-trigger focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-16 focus:ring-offset-black"
            aria-label="View ${artwork.name}, artwork ${index + 1} of ${seriesData.artworks.length}"
            tabindex="0"
          >
            <img
              src="https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_1920,f_auto,q_auto/${artwork.cloudinaryId}"
              alt="${artwork.altTag}"
              class="max-h-[calc(100vh-8rem)] mx-auto"
              loading="lazy"
            />
            <figcaption class="text-sm py-2 text-center text-white/80">
              <em>${artwork.name}</em>
              ${artwork.year ? `, ${artwork.year}` : ''}
              ${locationStr}
              ${mediaStr}${sizeStr}
              <br />
              Artist: Dr. Masumi Hayashi
            </figcaption>
          </button>
        </div>
      `;

      // Insert before navigation or append to end
      if (navigationSection) {
        container.insertBefore(section, navigationSection);
      } else {
        container.appendChild(section);
      }

      // Attach click handler to enter gallery mode
      const trigger = section.querySelector('.artwork-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          (trigger as HTMLElement).focus();

          // Enter gallery mode
          const galleryModeButton = document.querySelector('.gallery-mode-button');
          if (galleryModeButton && !galleryModeButton.classList.contains('hidden')) {
            (galleryModeButton as HTMLElement).click();
          }
        });

        // Focus handler for smooth scroll
        trigger.addEventListener('focus', (e) => {
          const section = trigger.closest('.artwork-section');
          if (section) {
            section.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        });
      }
    });
  }

  // Initialize scroll listener on page load
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.gallery-scroll-container');
    if (container) {
      // Throttled scroll handler
      let scrollTimeout: ReturnType<typeof setTimeout>;
      const throttledCheck = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkScrollPosition, 150);
      };

      container.addEventListener('scroll', throttledCheck, { passive: true });
    }
  });
}
