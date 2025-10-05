import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import fg from 'fast-glob';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Get all HTML files
const htmlFiles = fg.sync('src/**/*.html');
const input = htmlFiles.reduce((acc, file) => {
  const name = file.replace('src/', '').replace('.html', '').replace(/\//g, '-');
  acc[name] = resolve(__dirname, file);
  return acc;
}, {});

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '../assets/**/*',
          dest: 'assets'
        },
        {
          src: '../asset/**/*',
          dest: 'asset'
        },
        {
          src: '../CNAME',
          dest: '.'
        },
        {
          src: '../ads.txt',
          dest: '.'
        },
        {
          src: '../app-ads.txt',
          dest: '.'
        }
      ]
    })
  ]
});
