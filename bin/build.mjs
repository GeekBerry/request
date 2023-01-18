import url from 'node:url';
import path from 'node:path';
import esbuild from 'esbuild';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await esbuild.build({
  // entryPoints: ['src/index.mjs'],
  entryPoints: [path.resolve(__dirname, '../src/index.mjs')],
  // outfile: 'dist/index.mjs',
  outfile: path.resolve(__dirname, '../dist/index.mjs'),
  platform: 'browser',
  format: 'esm',
  sourcemap: true,
  bundle: true,
  minify: true,
});
