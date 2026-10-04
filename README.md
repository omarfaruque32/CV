# Omar Faruque — CV Portfolio

A responsive personal portfolio and downloadable CV for Omar Faruque, focused on technical project management across AI, GovTech, and SaaS delivery.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm test
```

This runs ESLint and a production Next.js build.

## Deploy to Vercel

Import this GitHub repository into Vercel. The project uses the standard Next.js build settings defined in `vercel.json` and requires no database or environment variables.

## Main content

- `app/page.tsx` — portfolio content and sections
- `app/globals.css` — responsive visual design
- `public/omar-faruque.jpg` — profile portrait
- `public/Omar_Faruque_CV.pdf` — downloadable CV
- `scripts/build_cv_pdf.py` — CV PDF generator
