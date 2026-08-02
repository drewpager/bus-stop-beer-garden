export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Overpass', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'bus-yellow': '#FCC200',
        'forest-green': '#2D5016',
      },
    },
  },
};
