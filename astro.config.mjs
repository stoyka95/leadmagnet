// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Static by default (fast first paint from ads); only the lead API route runs on demand.
export default defineConfig({
  site: 'https://fingramo.vercel.app',
  output: 'static',
  adapter: vercel(),
});
