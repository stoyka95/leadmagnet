// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Workaround (Astro 7.3 + @astrojs/vercel 11.0): the server bundle imports `rolldown`, whose native
// Linux binding is loaded dynamically, so Vercel's file tracing leaves it out of the function and
// /api/lead crashes with "Cannot find native binding". Ship the binding explicitly – only on the
// Linux build machine, where it is installed.
const includeFiles = process.platform === 'linux' ? ['./node_modules/@rolldown/binding-linux-x64-gnu/package.json', './node_modules/@rolldown/binding-linux-x64-gnu/rolldown-binding.linux-x64-gnu.node'] : [];

// Static by default (fast first paint from ads); only the lead API route runs on demand.
export default defineConfig({
  site: 'https://fingramo.vercel.app',
  output: 'static',
  adapter: vercel({ includeFiles }),
});
