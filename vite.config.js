import { resolve } from "path"
import { defineConfig } from 'vite';
import sveltePreprocess from 'svelte-preprocess';

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { replaceCodePlugin } from "vite-plugin-replace"
import { viteStaticCopy } from "vite-plugin-static-copy"

const production = !process.env.ROLLUP_WATCH;
const platform = process.env.PLATFORM;

export default defineConfig({
  root: "src",
  publicDir: "../public",
  server: { port: 8080 },
  build: {
    outDir: "../build",
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "src")
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [{
        src: "../node_modules/pdfjs-dist/build/pdf.worker.js",
        dest: "workers"
      }]
    }),
    replaceCodePlugin({
      replacements: [
        { from: "kPlatform", to: platform ?? "web" }
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
    })
  ]
})