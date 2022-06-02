import { defineConfig } from 'vite';
import sveltePreprocess from 'svelte-preprocess';

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { replaceCodePlugin } from "vite-plugin-replace"

const production = !process.env.ROLLUP_WATCH;
const platform = process.env.PLATFORM;

export default defineConfig({
  root: "src",
  publicDir: "../public",
  server: { port: 8080 },
  build: {
    outDir: "../build",
  },
  plugins: [
    replaceCodePlugin({
      replacements: [
        { from: "kPlatform", to: platform }
      ]
    }),
    svelte({
      preprocess: sveltePreprocess({
        sourceMap: !production,
        postcss: {
          plugins: [
            require('tailwindcss')(),
            require('autoprefixer')(),
          ],
        },
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production
      }
    })
  ]
})