import { banner } from './src/banner'
import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    banner: { js: banner },
    format: ['esm'],
    treeshake: true,
    sourcemap: true,
    clean: true,
    dts: true,
  },
])
