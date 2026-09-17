import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

/* The same two jobs as project 18. Open the page in the browser when
   the server starts, and check every type while you work.

   `npm test` reads this file too. The tests only need the first part,
   so the checker is left out while they run. */
export default defineConfig({
  server: { open: '/units.html' },
  plugins: process.env.VITEST ? [] : [checker({
    typescript: true,
    overlay: { initialIsOpen: false, position: 'br' }
  })]
});
