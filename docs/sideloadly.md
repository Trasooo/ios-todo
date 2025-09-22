# Installazione con Sideloadly (senza certificato a pagamento)

Questa guida ti consente di ottenere un `.ipa` non firmato e poi installarlo su iPhone/iPad con Sideloadly usando un Apple ID gratuito.

Nota: con Apple ID gratuito l'app scade dopo 7 giorni e richiede reinstallazione.

## Passo 1: crea l'IPA non firmato con GitHub Actions
1. Pubblica il progetto su un repository GitHub pubblico (vedi README).
2. Vai nella tab "Actions" del repo e avvia il workflow "Build iOS unsigned IPA" (workflow_dispatch).
3. Al termine, scarica l'artifact `ios-todo-unsigned-ipa` che contiene `ios-todo-unsigned.ipa`.

Se il workflow fallisce:
- Verifica che il prebuild Expo sia riuscito.
- Controlla la sezione Pod install e i log di `xcodebuild`.

## Passo 2: firma e installa con Sideloadly
1. Scarica e installa Sideloadly da https://sideloadly.io/ (Windows o macOS).
2. Collega il dispositivo iOS via USB o usa Wi‑Fi.
3. Trascina `ios-todo-unsigned.ipa` in Sideloadly.
4. Inserisci il tuo Apple ID quando richiesto.
5. Clicca Start per firmare e installare. Sideloadly creerà automaticamente un profilo di firma temporaneo.
6. Sul dispositivo: Impostazioni > Generali > Gestione VPN e dispositivo > Autorizza il profilo sviluppatore.

## Domande frequenti
- Errore di firma/profilo: prova a uscire/entrare in Sideloadly, o abilita l’autenticazione app‑specifica se richiesto.
- L’app si chiude subito: verifica di non aver rimosso permessi fondamentali o che il bundle identifier sia univoco.
- Serve un Mac? No per la firma via Sideloadly, ma la build .ipa non firmata viene generata su runner macOS (GitHub Actions) automaticamente.

## Note tecniche
- Il workflow usa `CODE_SIGNING_ALLOWED=NO` per produrre un `.app` non firmato, poi viene impacchettato in `.ipa`.
- L’IPA non è installabile direttamente su iOS senza firma; Sideloadly applica la firma usando il tuo Apple ID.
- Modifica il `bundleIdentifier` in `app.json` per evitare conflitti di pacchetto.
