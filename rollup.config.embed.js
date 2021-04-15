import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
  output: {
    format: 'iife',
    file: 'public/dist.js',
    sourcemap: false,
  },
  plugins: [
    svelte({
      emitCss: false,
      preprocess: sveltePreprocess({ sourceMap: !production }),
    }),
    resolve({ browser: true, dedupe: ['svelte'] }),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
  ],
};
