/**
 * esbuild configuration for bundling the extension.
 * Produces a single IIFE bundle that can be loaded via importScripts.
 */

import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  minify: false, // Keep readable for debugging
  sourcemap: true,
});

console.log('✅ Extension built successfully: dist/extension.js');
