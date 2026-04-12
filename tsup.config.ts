import { defineConfig } from 'tsup'

import { banner } from './src/banner'

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
