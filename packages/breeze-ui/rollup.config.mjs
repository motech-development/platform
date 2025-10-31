import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-exclude-dependencies-from-bundle';
import { swc } from 'rollup-plugin-swc3';
import pkg from './package.json' with { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.types,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        interop: 'compat',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        interop: 'compat',
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs(),
      swc({
        sourceMaps: true,
      }),
    ],
  },
];
