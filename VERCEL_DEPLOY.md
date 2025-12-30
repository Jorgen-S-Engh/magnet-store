# Deploy til Vercel og sett opp Blob Storage

## Steg 1: Deploy prosjektet til Vercel

### 1.1 Gå til Vercel
1. Gå til [vercel.com](https://vercel.com)
2. Logg inn (eller opprett konto hvis du ikke har det)
3. Klikk på **"Add New Project"** eller **"New Project"**

### 1.2 Koble til GitHub
1. Du vil se en liste over GitHub-repositories
2. Finn `magnet-store` (eller hva du kalte det) i listen
3. Klikk på **"Import"** ved siden av repositoryet

### 1.3 Konfigurer prosjektet
1. **Project Name:** La det stå som det er (eller endre hvis du vil)
2. **Framework Preset:** Next.js (skal være valgt automatisk)
3. **Root Directory:** La det stå som `./` (standard)
4. **Build and Output Settings:** La alt stå som standard
5. **Environment Variables:** Vi legger til dette senere
6. Klikk **"Deploy"**

### 1.4 Vent på deploy
- Vercel bygger og deployer prosjektet ditt
- Dette tar vanligvis 1-2 minutter
- Du vil se en progress bar og logger
- Når det er ferdig, får du en lenke til ditt deployede prosjekt (f.eks. `magnet-store.vercel.app`)

## Steg 2: Sett opp Blob Storage

### 2.1 Gå til Storage
1. I Vercel Dashboard, gå til ditt prosjekt
2. Klikk på **"Storage"** i venstre meny
3. Klikk på **"Create Database"** eller **"Create"** → **"Blob"**

### 2.2 Opprett Blob Store
1. Du vil se en liste over tilgjengelige storage-typer
2. Velg **"Blob"** (Vercel Blob Storage)
3. Gi den et navn (f.eks. `magnet-store-blob`)
4. Velg region (velg den nærmeste deg, f.eks. `iad1` for USA eller `fra1` for Europa)
5. Klikk **"Create"**

### 2.3 Token settes automatisk
- Når Blob Store er opprettet, settes `BLOB_READ_WRITE_TOKEN` automatisk som miljøvariabel
- Du trenger ikke gjøre noe mer!

## Steg 3: Verifiser at alt fungerer

### 3.1 Test bildeopplasting
1. Gå til din deployede side (lenken du fikk etter deploy)
2. Prøv å laste opp et bilde
3. Bildet skal lastes opp og vises!

### 3.2 Sjekk miljøvariabler (valgfritt)
1. Gå til prosjektet i Vercel Dashboard
2. Klikk på **"Settings"** → **"Environment Variables"**
3. Du skal se `BLOB_READ_WRITE_TOKEN` i listen
4. Den er automatisk tilgjengelig for alle miljøer (Production, Preview, Development)

## Steg 4: Automatisk deploy ved endringer

Nå er alt satt opp! Hver gang du pusher endringer til GitHub:
1. Vercel oppdager endringene automatisk
2. Bygger og deployer ny versjon
3. Blob Storage fungerer automatisk (tokenet er allerede satt)

## Feilsøking

### "Vercel Blob er ikke konfigurert" på deployet side
- Sjekk at du har opprettet Blob Store (se Steg 2)
- Vent noen sekunder og prøv igjen (det kan ta litt tid før tokenet er tilgjengelig)
- Gå til Settings → Environment Variables og sjekk at `BLOB_READ_WRITE_TOKEN` er der

### Bilder lastes ikke opp
- Sjekk nettleserkonsollen (F12 → Console) for feilmeldinger
- Sjekk at Blob Store er opprettet i Storage-seksjonen
- Prøv å redeploye prosjektet (Settings → Redeploy)

### Trenger du hjelp?
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Support](https://vercel.com/support)

## Neste steg

Nå kan du:
- ✅ Laste opp bilder på din deployede side
- ✅ Pushe endringer til GitHub og se dem automatisk deployet
- ✅ Bruke Blob Storage i produksjon

Gratulerer! 🎉

