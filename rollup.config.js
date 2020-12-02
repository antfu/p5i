import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import typescript from 'rollup-plugin-typescript2'

export default [
  {
    input: 'src/p5i.ts',
    sourcemap: true,
    output: [
      {
        file: 'dist/p5i.browser.js',
        format: 'umd',
        name: 'P5I',
      },
      {
        file: 'dist/p5i.js',
        format: 'cjs',
      },
      {
        file: 'dist/p5i.mjs',
        format: 'esm',
      },
    ],
    plugins: [typescript(), nodeResolve(), commonjs()],
  },
  {
    input: 'src/p5i.ts',
    output: [
      {
        file: 'dist/p5i.d.ts',
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
]
