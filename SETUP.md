# Hvordan sette opp Vercel Blob

## Hva er Vercel Blob?

Vercel Blob er en tjeneste som lagrer bildene dine på nettet. Når du laster opp et bilde, lagres det på Vercels servere, og du får en lenke til bildet.

## To måter å sette det opp på:

### Metode 1: Hvis du skal deploye til Vercel (anbefalt)

1. **Deploy prosjektet ditt til Vercel:**
   - Gå til [vercel.com](https://vercel.com) og logg inn
   - Klikk "Add New Project"
   - Last opp prosjektet ditt (eller koble det til GitHub)

2. **Aktiver Blob Storage:**
   - Når prosjektet er deployet, gå til prosjektet i Vercel Dashboard
   - Gå til "Storage" i menyen til venstre
   - Klikk "Create Database" eller "Create Store"
   - Velg "Blob" og følg instruksjonene
   - Tokenet settes automatisk!

3. **Ferdig!** Nå fungerer bildeopplasting automatisk når du deployer.

### Metode 2: For lokal utvikling (testing på din maskin)

Hvis du vil teste lokalt før du deployer:

1. **Opprett en Vercel-konto** (hvis du ikke har det):
   - Gå til [vercel.com](https://vercel.com) og opprett konto

2. **Installer Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Logg inn:**
   ```bash
   vercel login
   ```

4. **Koble prosjektet til Vercel:**
   ```bash
   vercel link
   ```
   (Følg instruksjonene som vises)

5. **Hent miljøvariabler:**
   ```bash
   vercel env pull .env.local
   ```
   Dette laster ned tokenet og legger det i en `.env.local` fil.

6. **Start utviklingsserveren:**
   ```bash
   npm run dev
   ```

## Alternativ: Manuell oppsett

Hvis du vil gjøre det manuelt:

1. Gå til [Vercel Dashboard](https://vercel.com/dashboard)
2. Velg ditt prosjekt (eller opprett et nytt)
3. Gå til "Settings" → "Environment Variables"
4. Legg til en ny variabel:
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** (du får denne når du oppretter Blob Storage)
5. Opprett en fil `.env.local` i prosjektmappen med:
   ```
   BLOB_READ_WRITE_TOKEN=lim_inn_tokenet_her
   ```

## Teste at det fungerer

1. Start serveren: `npm run dev`
2. Gå til http://localhost:3000
3. Prøv å laste opp et bilde
4. Hvis det ikke fungerer, sjekk at `.env.local` filen eksisterer og har riktig token

## Feilsøking

**Feilmelding: "Vercel Blob er ikke konfigurert"**
- Du mangler `.env.local` filen eller tokenet er feil
- Sjekk at filen heter nøyaktig `.env.local` (ikke `.env` eller `.env.example`)

**Feilmelding: "Unauthorized"**
- Tokenet er ugyldig eller utløpt
- Hent et nytt token fra Vercel Dashboard

**Bilder lastes ikke opp**
- Sjekk at du har installert pakken: `npm install`
- Sjekk konsollen i nettleseren (F12) for feilmeldinger

