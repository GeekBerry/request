const path = require('node:path');
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: [path.resolve(__dirname, '../src/index.mjs')],
  outfile: path.resolve(__dirname, '../dist/index.cjs'),
  platform: 'node',
  format: 'cjs',
  bundle: true,
  minify: true,
})
