This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Koble til GitHub (anbefalt)

Før du deployer, kan det være lurt å koble prosjektet til GitHub. Se [GITHUB_SETUP.md](./GITHUB_SETUP.md) for steg-for-steg instruksjoner.

### Installerer avhengigheter

Først, installer nødvendige pakker:

```bash
npm install
```

### Deploy til Vercel og sett opp Blob Storage

Nå som prosjektet er på GitHub, kan du deploye til Vercel:

**📖 Se [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for steg-for-steg instruksjoner!**

**Kortversjon:**
1. Gå til [vercel.com](https://vercel.com) → "Add New Project" → Velg ditt GitHub repository
2. Klikk "Deploy"
3. Etter deploy: Gå til "Storage" → "Create" → "Blob"
4. Ferdig! Tokenet settes automatisk.

**For lokal testing:** Se [SETUP.md](./SETUP.md)

### Admin-panel og passord

Admin-panelet på `/admin` er beskyttet med passord. Sett miljøvariabelen `ADMIN_PASSWORD`:

- **Lokalt:** Legg til i `.env.local`:
  ```
  ADMIN_PASSWORD=ditt-sikre-passord
  ```
- **Vercel:** Gå til prosjektet → Settings → Environment Variables → legg til `ADMIN_PASSWORD`

Uten denne variabelen vil admin-innlogging ikke fungere.

### Kjøre utviklingsserveren

Kjør utviklingsserveren:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren for å se resultatet.

Du kan laste opp bilder ved å dra og slippe dem i opplastingsområdet, eller ved å klikke på "Velg bilde"-knappen.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
