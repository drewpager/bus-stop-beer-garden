import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://beerbusstop.com',
  base: '/',
  integrations: [tailwind()],
});
