# Fikse GitHub-koblingen

Du har to problemer som må fikses:

## Problem 1: Feil remote URL

Du har brukt "ditt-brukernavn" i stedet for ditt faktiske GitHub-brukernavn.

## Problem 2: Autentisering

GitHub krever en Personal Access Token, ikke passord.

## Løsning - Steg for steg:

### Steg 1: Finn ditt GitHub-brukernavn

1. Gå til [github.com](https://github.com) og logg inn
2. Klikk på profilbildet ditt øverst til høyre
3. Ditt brukernavn står under navnet ditt (f.eks. hvis URL-en er `github.com/johndoe`, er brukernavnet `johndoe`)

### Steg 2: Opprett en Personal Access Token

1. Gå til GitHub → Klikk på profilbildet → **Settings**
2. Scroll ned til **Developer settings** (nederst i venstre meny)
3. Klikk på **Personal access tokens** → **Tokens (classic)**
4. Klikk **Generate new token** → **Generate new token (classic)**
5. Gi den et navn (f.eks. "magnet-store")
6. Velg utløpstid (f.eks. 90 dager eller "No expiration")
7. **Viktig:** Huk av `repo` (dette gir full tilgang til repositories)
8. Scroll ned og klikk **Generate token**
9. **VIKTIG:** Kopier tokenet NÅ! Du ser det bare én gang. Det ser ut som: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Steg 3: Fjern feil remote og legg til riktig

Kjør disse kommandoene i terminalen (erstatt `DITT-BRUKERNAVN` med ditt faktiske GitHub-brukernavn):

```bash
# Fjern feil remote
git remote remove origin

# Legg til riktig remote (erstatt DITT-BRUKERNAVN)
git remote add origin https://github.com/DITT-BRUKERNAVN/magnet-store.git

# Sjekk at det er riktig
git remote -v
```

**Eksempel:**
Hvis ditt brukernavn er `jorgen-engh`, blir det:
```bash
git remote remove origin
git remote add origin https://github.com/jorgen-engh/magnet-store.git
git remote -v
```

### Steg 4: Push med token

Nå kan du pushe. Når du blir bedt om passord, bruk tokenet du kopierte:

```bash
git push -u origin main
```

Når du blir spurt:
- **Username:** Ditt GitHub-brukernavn (ikke e-post)
- **Password:** Lim inn tokenet du kopierte (starter med `ghp_`)

### Alternativ: Bruk token direkte i URL (enklere)

Du kan også legge tokenet direkte i URL-en (men vær forsiktig - ikke del denne URL-en!):

```bash
git remote set-url origin https://DITT-BRUKERNAVN:TOKENET_DITT@github.com/DITT-BRUKERNAVN/magnet-store.git
```

**Eksempel:**
```bash
git remote set-url origin https://jorgen-engh:ghp_xxxxxxxxxxxx@github.com/jorgen-engh/magnet-store.git
```

Da trenger du ikke å skrive inn passord hver gang.

## Sjekk at det fungerte

Etter at du har pushet, gå til GitHub og sjekk at filene dine er der!

