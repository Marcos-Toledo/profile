# AGENT.md — Marcos Toledo · Profile / Landing Page

Landing page de perfil profissional (single page) de Marcos Toledo, desenvolvedor Front-End.

## Stack

- **Framework:** Astro 5 (file-based routing, `src/pages/index.astro` é a única rota)
- **Estilo:** Tailwind CSS v4 (via `@tailwindcss/vite`) + DaisyUI 5 (plugin)
- **Config Tailwind:** `tailwind.config.mjs` (v4 ainda usa `@config` em `src/styles/global.css`)
- **Ícones:** `astro-icon` + `@iconify-json/material-symbols`
- **Adapter/deploy:** `@astrojs/vercel` (também há `@astrojs/netlify` instalado e pasta `.netlify`, mas o adapter ativo é Vercel)
- **Site em produção:** `https://marcostoledo.vercel.app/`

## Comandos

```sh
npm run dev       # dev server em localhost:4321
npm run build     # build para ./dist/
npm run preview   # preview do build
```

Deploy manual (README): `npm run build && npx vercel deploy --prebuilt && npx vercel --prod`

## Estrutura

```
src/
├── layout/profile.astro      # HTML shell: SEO/OG/JSON-LD, <html class="dark">, Header + slot + Footer
├── sections/
│   ├── header.astro          # Nav sticky + menu mobile (JS inline) + botão Download CV
│   ├── hero.astro            # #about — badge "Disponível", título, bio, foto + links sociais
│   ├── experience.astro      # #experience — timeline com 5 experiências (array `experienceMap`)
│   ├── projects.astro        # #projects — grid de cards (array `projectsMap`), 4 projetos
│   ├── contact.astro         # #contact — e-mail, local e sociais (form está comentado)
│   └── footer.astro          # logo + copyright
├── components/contactForm.astro  # Form de contato (atualmente NÃO usado — comentado em contact.astro)
├── actions/index.ts          # Astro Action `postContact` → POST para webhook N8N (env N8N_WEBHOOK_PROD_URL)
├── javascript/contact.ts     # Lógica client-side do form (validação de erros, alertas)
├── middleware.ts             # CORS: libera apenas https://marcostoledo.vercel.app/
└── styles/global.css         # @import tailwindcss + @plugin daisyui + @config
public/assets/                # imagens dos projetos, foto do hero, PDF do CV
design/                       # profile-redesign.figcraft (spec do redesign v2: desktop + mobile + tokens) e previews PNG
```

## Convenções e padrões

- **Idioma da UI:** pt-BR unificado (redesign v2).
- **Dark mode:** site é dark-only — a paleta é aplicada direto, sem variantes `dark:`.
- **Tokens (redesign v2):** `accent` `#6C63FF`, `accent-soft` `#8B85FF`, `background` `#0C0C0F`, `surface` `#141419`, `hairline` `#24242C`, `foreground` `#F2F1EC`, `muted` `#8E8E97`, `paper` `#F2F1EC`, `ink` `#0C0C0F`. Fontes: Inter (`font-display`) + `font-mono` padrão do Tailwind para labels/metadados.
- **Conteúdo data-driven:** experiências e projetos vivem em arrays no frontmatter dos arquivos `.astro` — editar lá, não no markup.
- **Ícones sociais:** SVGs inline (GitHub/LinkedIn) duplicados em `hero.astro` e `contact.astro`.
- **Imagens:** importadas de `public/assets/images/` via `import` para obter `.src` (há um arquivo com espaço no nome: "Captura de tela de 2026-02-22 14-48-54.png").
- **CV:** `public/assets/file/20_de_abril_de_2026_CV.pdf`, aberto via `window.open` no header.

## Observações / débitos conhecidos

- `contactForm.astro` + `actions/index.ts` + `javascript/contact.ts` existem e funcionam (N8N → Google Sheets), mas o form está comentado em `contact.astro` — contato hoje é só mailto/links.
- Hero tem classes conflitantes: `w-64 h-64 lg:w-96 lg:h-96 w-56 h-56 lg:w-80 lg:h-80` (duplicadas).
- `security.checkOrigin: false` no `astro.config.mjs` — revisar se ainda é necessário.
- Botões "View Projects" / "Contact Me" no hero estão comentados.
- `.env.local` existe (contém `N8N_WEBHOOK_PROD_URL` provavelmente) — nunca commitar.
