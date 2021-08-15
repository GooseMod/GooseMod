import localResolve from 'rollup-plugin-local-resolve';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';

import pcImport from 'postcss-import';

const prod = !process.env.ROLLUP_WATCH;

import goosemod from './building/rollup-plugin-gm/index';


export default [
  {
    input: './src/index.js',
    
    output: {
      file: './dist/goosemod.js',
      format: 'iife',
      name: 'goosemod',
      sourcemap: !prod,
      
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

      postcss({
        minimize: prod,
        sourceMap: !prod,

        plugins: [
          pcImport()
        ]
      }),
      
      goosemod()
    ],
    
    // fix rollup jank
    inlineDynamicImports: true
  },
  
  {
    input: './bootstrap/index.js',

    output: {
      file: './dist/index.js',
      format: 'iife',
      name: 'goosemod_bootstrap',
      sourcemap: !prod,
      
      freeze: false /* do not freeze exports */
    },
    
    plugins: [
      localResolve(),
      prod && terser()
    ],
    
    // fix rollup jank
    inlineDynamicImports: true
  }
];