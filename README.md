# Country Explorer

A country data explorer built with React, TypeScript, Vite and Tailwind CSS. Data comes from the [REST Countries API](https://restcountries.com/).

## Features
- Home page with search form, region quick links (Africa, Americas, Asia, Europe, Oceania), summary stats and recent searches
- Country table (TanStack Table): flag, name, region, population; sorting by name and population; pagination
- Country detail page at `/countries/:countrycode` (React Router)
- Search validation with Formik + Yup (required, minimum 2 characters, letters and spaces only)
- Guest / Admin role switch in the navbar: guests see a "🔒 Locked" favorites button and an info banner, admins can save favorites
- Favorites and recent searches persisted in `localStorage` (Zustand `persist`)
- Light / dark theme toggle using Tailwind `dark:` classes on the root element

## Stack
React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Table, Formik, Yup, Zustand

## Getting started
```bash
npm install
npm run dev
```

Production build:
```bash
npm run build
```

## API fallback
If REST Countries is unreachable, the app can try a second API. Create a `.env` file with:

```
VITE_FALLBACK_API_URL=https://your-fallback-api.example/countries
```

The fallback must return an array of countries in REST Countries v2 or v3 shape (name, flag, region, population, alpha code).
