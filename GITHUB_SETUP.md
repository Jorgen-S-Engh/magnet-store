# Hvordan koble prosjektet til GitHub

## Steg 1: Sjekk om Git allerede er initialisert

Åpne terminalen i prosjektmappen og kjør:

```bash
git status
```

Hvis du får en feilmelding som "not a git repository", må du initialisere Git først (se steg 2).

## Steg 2: Initialiser Git (hvis nødvendig)

Hvis Git ikke er initialisert, kjør:

```bash
git init
```

## Steg 3: Legg til alle filer

```bash
git add .
```

## Steg 4: Lag din første commit

```bash
git commit -m "Initial commit - bildeopplasting med Vercel Blob"
```

## Steg 5: Opprett et nytt repository på GitHub

1. Gå til [github.com](https://github.com) og logg inn
2. Klikk på **"+"** ikonet øverst til høyre
3. Velg **"New repository"**
4. Fyll ut:
   - **Repository name:** `magnet-store` (eller hva du vil)
   - **Description:** (valgfritt) "Bildeopplasting med Vercel Blob"
   - **Public** eller **Private** (velg det du foretrekker)
   - **IKKE** huk av "Initialize this repository with a README" (vi har allerede filer)
5. Klikk **"Create repository"**

## Steg 6: Koble det lokale prosjektet til GitHub

Etter at du har opprettet repositoryet på GitHub, vil du se instruksjoner. Kjør disse kommandoene (erstatt `ditt-brukernavn` med ditt faktiske GitHub-brukernavn):

```bash
git remote add origin https://github.com/ditt-brukernavn/magnet-store.git
git branch -M main
git push -u origin main
```

**Eksempel:**
Hvis ditt GitHub-brukernavn er `johndoe`, blir kommandoen:
```bash
git remote add origin https://github.com/johndoe/magnet-store.git
git branch -M main
git push -u origin main
```

## Steg 7: Verifiser at det fungerte

Gå til GitHub og oppdater siden. Du skal nå se alle filene dine der!

## Hvis du får feilmeldinger

### "Permission denied" eller autentisering
GitHub krever nå autentisering. Du kan bruke:

**Alternativ 1: Personal Access Token (anbefalt)**
1. Gå til GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klikk "Generate new token"
3. Gi den navn og velg scope: `repo`
4. Kopier tokenet (du ser det bare én gang!)
5. Når du pusher, bruk tokenet som passord

**Alternativ 2: GitHub CLI**
```bash
# Installer GitHub CLI
npm install -g gh

# Logg inn
gh auth login

# Nå kan du pushe normalt
git push -u origin main
```

**Alternativ 3: SSH-nøkkel**
Hvis du har SSH-nøkkel satt opp, kan du bruke SSH-URL i stedet:
```bash
git remote set-url origin git@github.com:ditt-brukernavn/magnet-store.git
```

## Neste steg: Deploy til Vercel

Når prosjektet er på GitHub, kan du enkelt deploye til Vercel:

1. Gå til [vercel.com](https://vercel.com)
2. Klikk "Add New Project"
3. Velg GitHub og velg ditt `magnet-store` repository
4. Klikk "Deploy"
5. Etter deploy, gå til Storage → Create Blob Store

Se [SETUP.md](./SETUP.md) for mer info om Vercel Blob!

