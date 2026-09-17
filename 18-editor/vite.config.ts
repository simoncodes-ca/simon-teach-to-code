import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

/* Two jobs, the same as project 17. Open the editor in the browser when
   the server starts, and check every type while you work.

   The checker prints its errors in the terminal. It also puts a small
   badge in the corner of the page with the number of errors. Click the
   badge to read the list.

   `npm test` reads this file too. The tests only need the first part,
   so the checker is left out while they run. */
export default defineConfig({
  server: { open: '/editor.html' },
  plugins: process.env.VITEST ? [] : [checker({
    typescript: true,
    overlay: { initialIsOpen: false, position: 'br' }
  })]
});
