import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-exclude-dependencies-from-bundle';
import { swc } from 'rollup-plugin-swc3';
import pkg from './package.json';

export default [
  {
    input: 'src/axios-hooks.ts',
    output: [
      {
        file: pkg.types,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  {
    input: 'src/axios-hooks.ts',
    output: [
      {
        exports: 'named',
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        exports: 'named',
        file: pkg.module,
        format: 'es',
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
