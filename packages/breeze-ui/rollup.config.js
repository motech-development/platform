import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    external: {
      ...pkg.peerDependencies,
    },
    plugins: [
      external(),
      typescript({
        clean: true,
        rollupCommonJSResolveHack: true,
        tsconfigOverride: {
          exclude: ['**/*.stories.tsx'],
        },
      }),
      resolve({
        extensions: ['.ts', '.tsx'],
      }),
      commonjs(),
    ],
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
  },
];
