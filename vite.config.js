import { resolve } from "path"
import { defineConfig } from 'vite';
import sveltePreprocess from 'svelte-preprocess';
import mkcert from "vite-plugin-mkcert"

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { replaceCodePlugin } from "vite-plugin-replace"
import { viteStaticCopy } from "vite-plugin-static-copy"
import { VitePWA } from "vite-plugin-pwa";

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
        dest: "workers",
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
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "assets/*",
        "models/**",
        "icons/android-chrome-*.png",
        "workers/*",
        "index.html",
        "favicon.png",
      ],
      manifest: {
        name: "standards utility",
        short_name: "standards",
        description: "a practice tracking app with useful shortcuts",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: 'icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    mkcert(),
  ]
})