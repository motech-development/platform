import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import external from 'rollup-plugin-exclude-dependencies-from-bundle';
import pkg from './package.json';

export default [
  {
    input: 'src/outputs-env-plugin.ts',
    output: [
      {
        file: pkg.types,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  {
    input: 'src/outputs-env-plugin.ts',
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
      esbuild(),
    ],
  },
];
