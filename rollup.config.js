import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json'

import pkg from './package.json';

const plugins = [
  external(),
  json({
    include: 'node_modules/**',
    preferConst: true,
  }),
  babel({
    exclude: 'node_modules/**',
    plugins: ['external-helpers']
  }),
  resolve(),
  commonjs()
]

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins
  },
  {
    input: 'cli/csv-normalizer.js',
    output: [
      {
        file: pkg.bin['csv-normalizer'],
        format: 'cjs'
      }
    ],
    plugins
  }
];
