import { defineConfig } from 'astro/config';

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://wp-detector.com",
  trailingSlash: "never",
  integrations: [sitemap()],
});