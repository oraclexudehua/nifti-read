import babel from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import browserifyPlugin from 'rollup-plugin-browserify-transform';
import replace from '@rollup/plugin-replace';
import { uglify } from 'rollup-plugin-uglify';

const config = {
  input: './src/nifti.js',
  output: {
    dir: './test/test-nifti-load/src/output',
    format: 'es',
    globals: {
      jquery: '$',
    },
  },
  // treeshake: false,
  external: [/node_modules/],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**', // Default: undefined
      // exclude: ["node_modules/nifti-reader-js/**", "node_modules/bar/**"], // Default: undefined
      // these values can also be regular expressions
      // include: /node_modules/
      dynamicRequireTargets: ['node_modules/nifti-reader-js/*.js'],

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      extensions: ['.js', '.coffee'], // Default: [ '.js' ]

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false, // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false, // Default: true

      // explicitly specify unresolvable named exports
      // (see below for more details)
      namedExports: { react: ['createElement', 'Component'] }, // Default: undefined

      // sometimes you have to leave require statements
      // unconverted. Pass an array containing the IDs
      // or a `id => boolean` function. Only use this
      // option if you know what you're doing!
      ignore: ['conditional-runtime-dependency'],
    }),
    babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
    // uglify(),
  ],
};

export default config;
