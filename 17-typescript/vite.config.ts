import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

/* Two jobs. Open the game in the browser when the server starts, and
   check every type while you work.

   The checker prints its errors in the terminal. It also puts a small
   badge in the corner of the page with the number of errors. Click the
   badge to read the list. */
export default defineConfig({
  server: { open: '/tanks.html' },
  plugins: [checker({
    typescript: true,
    overlay: { initialIsOpen: false, position: 'br' }
  })]
});
