import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json'

import pkg from './package.json';

const plugins = [
  json({
    include: 'node_modules/**',
    preferConst: true,
  }),
  babel({
    exclude: 'node_modules/**',
    plugins: ['external-helpers'],
    runtimeHelpers: true,
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
    input: 'src/cli.js',
    output: [
      {
        file: pkg.bin['csv-normalizer'],
        format: 'cjs',
        banner: '#!/usr/bin/env node'
      }
    ],
    plugins
  }
];
