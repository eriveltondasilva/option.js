import { banner } from './src/banner'
import { defineConfig } from 'tsup'

const entry = ['./src/index.ts']

export default defineConfig([
  {
    entry,
    treeshake: true,
    dts: true,
    cjsInterop: true,
    format: ['esm', 'cjs'],
    banner: {
      js: banner,
    },
  },
])
