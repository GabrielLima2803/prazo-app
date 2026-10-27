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

Arquitetura por feature. As dependências só descem: `app → features → core → shared → theme`.

```
src/
├── app/                    rotas (Expo Router), finas: só reexportam telas das features
├── features/               uma pasta por domínio, com o seu index.ts como API pública
│   ├── auth/               login com o Moodle ou pela URL do calendário
│   ├── deadlines/          lista, detalhe, urgência, agrupamento por dia
│   ├── courses/            cor e visibilidade de cada disciplina
│   ├── preferences/        hooks e transformações puras das preferências
│   ├── google/             conectar o Google Agenda e o passo de onboarding
│   ├── sync/               status e "sincronizar agora"
│   ├── account/            conta do Moodle conectada
│   └── settings/           tela de Ajustes, composta por seções
├── core/
│   ├── api/                tipos (espelham internal/api do Go), cliente HTTP, endpoints, erros, demo
│   ├── query/              QueryClient, query keys e useApi
│   ├── session/            conexão atual (SecureStore) e logout por erro de sessão
│   ├── storage/            armazenamento seguro
│   ├── config/             variáveis de ambiente
│   └── providers/          providers do app
├── shared/
│   ├── components/         UI kit genérico (Button, Card, Field, Notice…)
│   ├── hooks/              useNow, useScreenPadding
│   ├── lib/                tempo, datas em pt-BR, durações, texto, haptics
│   └── types/
└── theme/                  tokens: cores, espaçamento, raios, tamanhos, opacidades, tipografia
```

Dentro de cada feature: `api.ts` (hooks do React Query), `components/`, `hooks/`, `lib/` (funções puras), `constants.ts`, `screens/` e `index.ts`.

- **Sem números mágicos:** medidas vêm de `theme/` (`spacing`, `radius`, `size`, `iconSize`, `opacity`, `alpha`) e durações de `shared/lib/time.ts`.
- **Dados:** React Query com cache por conexão (`core/query/keys.ts`) e atualização otimista nas preferências.
- **Token:** guardado no Keychain/Keystore via `expo-secure-store`.
- **Contrato:** `src/core/api/types.ts` espelha `internal/api/types.go` do servidor.

## Qualidade

```sh
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

## Limitações atuais

- A API é HTTP na rede local, protegida por token. Para acessar fora de casa, o caminho é HTTPS (ex.: Tailscale ou um proxy com TLS).
- Ocultar uma disciplina tira os prazos dela das próximas sincronizações, mas os eventos já criados só saem do Google quando o servidor ganhar o estado da Fase 3.
