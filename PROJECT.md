# ExpatBase — ako web funguje (kontext pre agenta)

## Čo to je
Statický web (čisté HTML/CSS/JS, BEZ build procesu a BEZ frameworku).
~30 HTML stránok + zdieľaný `listings.js` + obrázky (.webp) + `logo.svg`
+ `sitemap.xml`, `robots.txt`. Žiadny npm build, žiadny React.

## Kde je uložený (zdroj kódu)
- **Lokálne na počítači majiteľky (hlavný pracovný zdroj):**
  `/Users/annalockwoodova/Documents/GitHub/ExpatEase/ExpatEase/ExpatEase`
- **GitHub (verzovanie/záloha):**
  https://github.com/avolesnes-tech/expatease-slovakia  (vetva `main`)
- Pozn.: GitHub môže byť pozadu za živým webom — niektoré zmeny sa nasadia
  cez wrangler bez commitu. Zdroj pravdy pre „najnovšie" je lokálny priečinok.

## Kde a ako sa aktualizuje (nasadenie)
- **Hosting:** Cloudflare Pages, projekt `expatease-final`, doména expatbase.sk
- **Nasadenie (publish) ide LEN takto, z počítača majiteľky:**
  ```
  cd "/Users/annalockwoodova/Documents/GitHub/ExpatEase/ExpatEase/ExpatEase"
  npx wrangler pages deploy . --project-name=expatease-final
  ```
- **Dôležité:** samotný `git push`/úprava na GitHub webe NEnasadí web na živo
  (Pages nie je prepojený s Gitom pre auto-deploy — ak by to malo platiť,
  treba to najprv overiť v Cloudflare → Pages → projekt → Settings).
- Limit: jeden súbor max 25 MiB. Deploy sa MUSÍ spúšťať z priečinka projektu
  (nie z domovského priečinka ~).

## Dynamický obsah (NIE je v HTML súboroch!)
- **Databáza: Supabase** (projekt `etxqrlrqbjcbjmitnspv`,
  https://etxqrlrqbjcbjmitnspv.supabase.co).
  Tabuľky: `businesses` (firmy), `reviews` (recenzie), `events` (interné
  štatistiky), členovia komunity. Auth: magic link. Úložisko obrázkov:
  bucket `business-media` (public).
- Zoznamy firiem a recenzie sa načítavajú za behu z Supabase → menia sa
  v Supabase, NIE úpravou HTML ani nasadením.
- V klientskom kóde je len verejný „publishable" kľúč (to je v poriadku).
  Tajné kľúče NIE sú v kóde.

## Serverless funkcie
- `functions/*.js` = Cloudflare Pages Functions:
  `airtable-submit.js` (zápisy do Airtable), `send-email.js` (Brevo e-maily),
  `submit-business.js` (registrácia firmy).
- Tajné kľúče (AIRTABLE_TOKEN, BREVO_API_KEY, ADMIN_EMAIL) sú uložené ako
  Environment Variables v Cloudflare Pages dashboarde — NIE v kóde.

## E-mail
- Príjem: Cloudflare Email Routing (hello@expatbase.sk → súkromný Gmail).
- Odosielanie: Brevo (SMTP + API), magic linky cez Supabase custom SMTP.

## Pracovný postup pre agenta, ktorý NEMÁ prístup k počítaču
1. Agent uprav súbor a vráti HOTOVÝ súbor (alebo presný „nájdi → nahraď").
2. Majiteľka zmenu dostane do lokálneho priečinka (upload / GitHub web /
   prepojený počítač).
3. Aby to išlo NA ŽIVO, musí sa z počítača spustiť wrangler deploy (viď vyššie).
   Bez tohto kroku sa zmena na expatbase.sk neprejaví.
