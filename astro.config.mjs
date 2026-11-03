// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://devtoledo.cloud/",
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [icon()],
  adapter: vercel()
  });