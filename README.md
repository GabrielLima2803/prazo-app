# Prazo — app

App em React Native (Expo SDK 58) do [Prazo](https://github.com/GabrielLima2803/prazo-sync): mostra os prazos do Moodle da UDESC, deixa escolher a cor de cada disciplina, os lembretes por tipo e o que fica oculto. A sincronização com o Google Agenda continua no servidor Go; o app conversa com ele pela API.

| Prazos | Detalhe | Disciplinas | Ajustes |
|---|---|---|---|
| próximo prazo em destaque, contagens de 24 h / 7 dias / semestre, lista por dia | horário real ou "até HH:MM", lembretes, botão para abrir no Moodle | cor no Google Agenda (as 11 cores do Google) e mostrar/ocultar | sincronizar agora, lembretes por tipo, tipos visíveis, conexão |

Tema claro e escuro automáticos, fonte Inter, feedback háptico.

## Rodando no celular

1. **Servidor** (no repositório `prazo-sync`), com `PRAZO_API_TOKEN` no `.env` (gere com `prazo keygen`):

   ```sh
   set -a; . ./.env; set +a
   PRAZO_HTTP_ADDR=0.0.0.0:8080 go run ./cmd/prazo serve
   # → No app, use o servidor: http://192.168.0.14:8080
   ```

2. **App**:

   ```sh
   npm install
   npx expo start
   ```

3. Instale o **Expo Go** no celular, leia o QR code e, na tela de conexão, informe o endereço mostrado pelo servidor e o `PRAZO_API_TOKEN`.

Celular e computador precisam estar na mesma rede Wi-Fi. Sem servidor, use **"Explorar com dados de exemplo"**.

## Estrutura

```
src/
├── app/                 rotas (Expo Router)
│   ├── _layout.tsx      providers, fontes e a pilha protegida por conexão
│   ├── connect.tsx      conexão com o servidor ou modo demonstração
│   ├── (tabs)/          Prazos, Disciplinas, Ajustes
│   └── deadline/[id]    detalhe do prazo (modal)
├── api/                 tipos (espelham internal/api do Go), cliente HTTP, demo, hooks do React Query
├── components/          UI reutilizável
├── lib/                 datas em pt-BR, armazenamento seguro, ícones
├── state/               conexão atual (SecureStore)
└── theme/               tokens de cor, espaçamento e tipografia
```

- **Dados:** React Query com cache por conexão e atualização otimista nas preferências.
- **Token:** guardado no Keychain/Keystore via `expo-secure-store`.
- **Contrato:** `src/api/types.ts` espelha `internal/api/types.go` do servidor.

## Qualidade

```sh
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

## Limitações atuais

- A API é HTTP na rede local, protegida por token. Para acessar fora de casa, o caminho é HTTPS (ex.: Tailscale ou um proxy com TLS).
- Ocultar uma disciplina tira os prazos dela das próximas sincronizações, mas os eventos já criados só saem do Google quando o servidor ganhar o estado da Fase 3.
