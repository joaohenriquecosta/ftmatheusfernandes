# ftmatheusfernandes.com.br

Marketing site for sports physiotherapist Matheus Fernandes — Next.js (App Router), Tailwind CSS v4, TypeScript.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server (after build)
- `npm run lint` — ESLint

## Project layout

- `app/page.tsx` — home page (“coming soon”).
- `app/turmas/uberaba/page.tsx` — Uberaba cohort page.
- `app/layout.tsx` — fonts (Inter, Fraunces) and global metadata.
- `public/proposta/index.html` — static commercial proposal document (also served at `/proposta` via rewrite in `next.config.ts`).

## Deploy

Intended for deployment on [Vercel](https://vercel.com) (same ecosystem as Next.js).
