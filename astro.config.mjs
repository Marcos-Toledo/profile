// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

// import netlify from "@astrojs/netlify";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  // Altere para a URL real do seu site em produção
  output: "server",
  site: "https://marcostoledo.vercel.app/",

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [icon()],

  // adapter: netlify(),
  adapter: vercel()
  });