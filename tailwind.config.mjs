export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "accent": "#6C63FF",
        "accent-soft": "#8B85FF",
        "background": "#0C0C0F",
        "surface": "#141419",
        "hairline": "#24242C",
        "foreground": "#F2F1EC",
        "muted": "#8E8E97",
        "paper": "#F2F1EC",
        "ink": "#0C0C0F",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
