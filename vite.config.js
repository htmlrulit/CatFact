import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import purgecss from "@fullhuman/postcss-purgecss"
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [react(),legacy({
    targets: ['defaults', 'not IE 11'],
  })],
  server: {
    port: 10888,
  },
  build: {
    target: "ES2018",
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames:"assets/[ext]/[name]-[hash:16][extname]",
        chunkFileNames:"assets/js/[name]-[hash:16].js",
        entryFileNames:"assets/js/[name]-[hash:16].js",
        banner:"/**\n * @license MIT\n *\n * Copyright (c) https://ban.su/\n */",
      },
      
    }
  },
  css: {
    postcss: {
      plugins: [
        purgecss({
          content: ["build/**/*","src/**/*"],
          safelist: [/^vkui/],
          variables: true,
          keyframes: true,
          fontFace: true,
        })
      ]
    }
  },
  preview: {
    port: 10888,
  },
});