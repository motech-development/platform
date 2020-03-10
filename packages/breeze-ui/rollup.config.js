import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
  {
    external: {
      ...pkg.peerDependencies,
      ...pkg.dependencies,
    },
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
      typescript({
        clean: true,
        rollupCommonJSResolveHack: true,
        tsconfigOverride: {
          exclude: [
            '**/__tests__/*.ts',
            '**/__tests__/*.tsx',
            '**/*.stories.tsx',
            'src/setupTests.ts',
          ],
        },
      }),
      resolve({
        extensions: ['.ts', '.tsx'],
      }),
      commonjs(),
    ],
  },
];
