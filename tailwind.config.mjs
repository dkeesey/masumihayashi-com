import typography from '@tailwindcss/typography'
import colors from 'tailwindcss/colors'
import { primaryTheme, familyAlbumTheme, artworkTheme, familyAlbumPlugin, artworkGalleryPlugin } from './src/theme/index.ts'

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  plugins: [
    typography,
    familyAlbumPlugin,
    artworkGalleryPlugin
  ],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        ...primaryTheme.colors,
        ...familyAlbumTheme.colors,
        ...artworkTheme.colors,
      },
      fontFamily: {
        ...primaryTheme.fontFamily,
        ...familyAlbumTheme.fontFamily,
        ...artworkTheme.fontFamily,
      },
      boxShadow: {
        upward: "0 -4px 10px -5px rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in'
      }
    },
  },
};
