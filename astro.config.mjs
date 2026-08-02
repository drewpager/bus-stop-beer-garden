import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://drewpager.github.io',
  base: '/',
  integrations: [tailwind()],
});
