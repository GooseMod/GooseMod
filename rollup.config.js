import localResolve from 'rollup-plugin-local-resolve';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';

const prod = !process.env.ROLLUP_WATCH;

import goosemod from './building/rollup-plugin-gm/index';


export default {
  input: './src/index.js',

  output: {
    file: './dist/index.js',
    format: 'iife',
    name: 'goosemod',
    sourcemap: false,

    freeze: false /* do not freeze exports */
  },

  plugins: [
    localResolve(),
    prod && terser(),

    !prod && serve({
      contentBase: 'dist',
      port: 1234,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    }),

    goosemod()
  ],

  // fix rollup jank
  inlineDynamicImports: true
};