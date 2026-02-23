// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  // Altere para a URL real do seu site em produção
  site: "https://profile-marcostoledo.vercel.app/",

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [icon()],
  adapter: netlify()
});