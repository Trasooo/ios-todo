# Promemoria Emoji (Expo)

Una semplice app To‑Do creata con Expo/React Native. Supporta:
- Aggiunta, toggle, e rimozione task
- Persistenza locale con AsyncStorage
- Build IPA via EAS Build
- Emoji per ogni promemoria (tieni premuta l'emoji per cambiarla)
- Modale crediti

## Requisiti
- Node.js LTS installato
- Account Expo (gratuito)
- Account Apple Developer per firmare IPA (necessario per installazione su dispositivi)

## Installazione
```powershell
cd ios-todo
npm install -g expo-cli eas-cli
npm install
```

Avvio in sviluppo:
```powershell
npm run start
```

## Configurazione iOS
Aggiorna il bundle identifier in `app.json` con il tuo dominio rovesciato:
```json
{
  "expo": { "ios": { "bundleIdentifier": "com.tuo.domini.o.iostodo" } }
}
```

Per cambiare nome app o icona:
- Nome visibile: `expo.name` in `app.json` (es. "Promemoria Emoji")
- Icona: sostituisci `assets/icon.png` (512x512). Puoi rigenerarla con `node scripts/generate-icon.js`

## Build IPA con EAS
EAS Build compila sul cloud (funziona anche su Windows).

1. Login:
```powershell
eas login
```
2. Inizializza EAS (se richiesto):
```powershell
eas build:configure
```
3. Avvia build iOS in produzione (IPA):
```powershell
eas build --platform ios --profile production
```
4. Segui il flusso per le credenziali Apple. Al termine scarica l'IPA dal link.

Note:
- Per installare l'IPA su dispositivi, includili nel provisioning profile oppure usa TestFlight.
- Per distribuzione interna veloce: `--profile preview`.

## Alternativa senza certificato a pagamento: Sideloadly
(workflow pronto: https://github.com/Trasooo/ios-todo/actions)
Se non hai l'Apple Developer a pagamento, puoi installare l'app con Sideloadly usando il tuo Apple ID gratuito (validità 7 giorni).

Percorso consigliato:
1) Genera un IPA non firmato con GitHub Actions (macOS runner)
2) Scarica l'artefatto `.ipa`
3) Re‑sign e installa con Sideloadly

Vedi la guida: `docs/sideloadly.md`.

## Crea una repo pubblica su GitHub
Con GitHub CLI:
```powershell
# dalla cartella ios-todo
git init
git add .
git commit -m "chore: initial commit"
gh auth login
gh repo create ios-todo --public --source . --remote origin --push
```

Manuale:
```powershell
git init
git add .
git commit -m "chore: initial commit"
git remote add origin https://github.com/<TUO-UTENTE>/ios-todo.git
git branch -M main
git push -u origin main
```

## Struttura
- `src/App.js` componente principale con logica To‑Do
- `app.json` configurazione Expo
- `eas.json` profili build EAS
 - `.github/workflows/ios-unsigned.yml` workflow per IPA non firmato (per Sideloadly)

## Licenza
MIT