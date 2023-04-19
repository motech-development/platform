import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-exclude-dependencies-from-bundle';
import { swc } from 'rollup-plugin-swc3';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/webpack-permissions-plugin.ts',
    output: [
      {
        file: pkg.types,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  {
    input: 'src/webpack-permissions-plugin.ts',
    output: [
      {
        exports: 'default',
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve({
        extensions: ['.js', '.ts'],
        preferBuiltins: true,
      }),
      commonjs(),
      swc({
        sourceMaps: true,
      }),
    ],
  },
];
