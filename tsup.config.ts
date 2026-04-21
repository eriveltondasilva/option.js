import { defineConfig } from 'tsup'

import pkg from './package.json'

const { name, description, version, author, license, homepage } = pkg
const year = new Date().getFullYear()

const isProduction = process.env.NODE_ENV === 'production'

export const banner = `
/**
 * ${name?.toUpperCase()} - v${version}
 *
 * ${description || 'no description'}
 *
 * @author ${author.name} <${author.email}>
 * @license ${license?.toUpperCase()}
 * @copyright ${year} ${author.name}
 *
 * @see ${homepage} - Documentation
 *
 * Inspired by:
 * @see https://doc.rust-lang.org/std/option - Rust Option Type
 * @see https://hexdocs.pm/gleam_stdlib/gleam/option.html - Gleam Option Type
 */`

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    banner: { js: banner },
    dts: { banner },
    format: ['esm'],
    treeshake: true,
    clean: true,
    sourcemap: !isProduction,
    minify: isProduction,
  },
])
