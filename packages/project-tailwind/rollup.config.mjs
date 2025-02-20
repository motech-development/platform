import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-exclude-dependencies-from-bundle';
import postcss from 'rollup-plugin-postcss';
import { swc } from 'rollup-plugin-swc3';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    external: [/\.css$/],
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
      postcss({
        config: {
          path: 'postcss.config.js',
        },
        extensions: ['.css'],
        inject: {
          insertAt: 'top',
        },
        minimize: true,
      }),
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
