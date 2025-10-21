// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://masumihayashi.com',

  devToolbar: {
    enabled: false,
  },

  experimental: {
    clientPrerender: true, // Enables faster page transitions
  },

  integrations: [
    react({
      include: ['**/react/*', '**/components/**/*.tsx', '**/components/**/*.jsx'],
    }),
    mdx(),
    sitemap()
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@components': path.resolve('./src/components'),
        '@content': path.resolve('./src/content'),
        '@data': path.resolve('./src/data'),
        '@images': path.resolve('./src/images'),
        '@layouts': path.resolve('./src/layouts'),
        '@lib': path.resolve('./src/lib'),
        '@pages': path.resolve('./src/pages'),
        '@stores': path.resolve('./src/stores'),
        '@styles': path.resolve('./src/styles'),
        '@theme': path.resolve('./src/theme'),
        '@types': path.resolve('./src/types'),
        '@utils': path.resolve('./src/utils'),
      }
    }
  },

  output: 'static',

  build: {
    inlineScripts: true
  }
});