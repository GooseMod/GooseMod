import { resolve } from 'path';
import { readdirSync } from 'fs';

// Rollup plugins
import localResolve from 'rollup-plugin-local-resolve';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';

// PostCSS plugins
import pcImport from 'postcss-import';

// Custom plugins
import goosemod from './building/rollup-plugin-gm/index';
const goosemodBootstrap = () => ({
  name: 'goosemod-bootstrap',

  renderChunk: async (code) => code.replaceAll('<buildtime>', Date.now())
});

const ignoreEvalWarnings = (warning, warn) => {
  if (warning.code === 'EVAL') return; // Suppress eval warnings
  warn(warning);
};

const prod = !process.env.ROLLUP_WATCH;


export default [
  {
    input: './src/index.js',
    
    output: {
      file: './dist/goosemod.js',
      format: 'iife',
      name: 'goosemod',
      sourcemap: !prod,
      
      freeze: false // Do not freeze exports
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
          pcImport({
            resolve: (id, base, opts) => { // Resolve for @import
              if (id.endsWith('/')) { // Directory resolving, eg: test/ imports all css files in test dir
                const dir = resolve(base, id);
                return readdirSync(dir).filter((x) => x.split('.').pop().startsWith('css')).map((x) => resolve(dir, x));
              }

              return resolve(base, id);
            },
          })
        ]
      }),
      
      goosemod()
    ],

    onwarn: ignoreEvalWarnings,

    inlineDynamicImports: true // Fix rollup jank
  },
  
  {
    input: './bootstrap/index.js',

    output: {
      file: './dist/index.js',
      format: 'iife',
      name: 'goosemod_bootstrap',
      sourcemap: !prod,
      
      freeze: false // Do not freeze exports
    },
    
    plugins: [
      localResolve(),
      prod && terser(),

      goosemodBootstrap()
    ],

    onwarn: ignoreEvalWarnings,

    inlineDynamicImports: true // Fix rollup jank
  }
];