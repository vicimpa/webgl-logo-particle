import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  base: './',
  root: './src',
  publicDir: '../public',
  build: {
    emptyOutDir: true,
    outDir: '../dist'
  },
  server: {
    host: true,
    port: 3000
  },
  plugins: [glsl({ minify: process.argv.includes('build') })]
});