import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-exclude-dependencies-from-bundle';
import pkg from './package.json';

export default [
  {
    input: 'src/useQueryString.ts',
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
      babel({
        babelHelpers: 'runtime',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
    ],
  },
];
