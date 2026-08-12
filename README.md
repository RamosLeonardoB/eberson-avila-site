# Éberson Ávila — Site oficial (Next.js)

Site institucional em **Next.js (Pages Router) + JavaScript/JSX + Tailwind CSS**, com agenda de shows sincronizada em tempo real via **Google Calendar API** (rota serverless), pronto para deploy contínuo na **Vercel**.

> **Nota sobre a estrutura pedida no briefing:** o briefing lista `/pages/index.tsx`, mas também exige "estritamente JavaScript (.js/.jsx)". Como TypeScript e JavaScript puro são mutuamente exclusivos, priorizei a exigência explícita da seção 1 ("strictly JavaScript") e criei `/pages/index.jsx`. Se a intenção real era TypeScript, é só renomear o arquivo para `.tsx` e adicionar `typescript` + `@types/react` como dependências — o código já é 100% compatível.

---

## Stack

- **Next.js 14** (Pages Router) — build testado e validado (`npm run build` compila limpo)
- **React 18**
- **Tailwind CSS 3** com paleta e tipografia customizadas em `tailwind.config.js`
- **Google Calendar API** consumida via rota serverless (`/pages/api/agenda.js`), nunca direto do browser — a chave de API fica só no servidor

## Estrutura de pastas

```
eberson-nextjs/
├── pages/
│   ├── index.jsx          → página principal, monta todas as seções
│   ├── _app.js             → injeta o CSS global
│   └── api/
│       └── agenda.js       → rota serverless: busca, filtra e sanitiza eventos do Google Agenda
├── components/
│   ├── Header.jsx           → navegação fixa + CTA
│   ├── Hero.jsx              → seção fullscreen (h-screen)
│   ├── Agenda.jsx            → consome /api/agenda, cards responsivos
│   ├── Gallery.jsx           → grid de fotos com zoom no hover e lightbox
│   ├── BookingForm.jsx       → formulário B2B de contratação
│   └── Footer.jsx            → rodapé institucional
├── styles/globals.css        → Tailwind + reset + seleção de texto + scroll suave
├── public/images/             → imagens estáticas (hero, galeria)
├── tailwind.config.js         → paleta charcoal / brand red, tracking-widest25
├── .env.example                → variáveis do Google Calendar
└── next.config.js
```

---

## 1. Rodar localmente

```bash
npm install
cp .env.example .env.local   # depois preencha com suas credenciais (opcional em dev)
npm run dev
```

Acesse `http://localhost:3000`. Sem as variáveis de ambiente configuradas, a seção Agenda mostra dados de demonstração automaticamente — o layout nunca quebra.

---

## 2. Conectar a Agenda a uma planilha do Google Sheets

**Por que planilha em vez de Google Agenda:** sem risco de misturar compromissos pessoais do artista com shows, sem precisar lembrar de marcar uma etiqueta em cada evento, e sem exigir projeto/chave de API no Google Cloud — a rota serverless só lê um CSV público.

### Passo a passo

**a) Crie a planilha** em [sheets.google.com](https://sheets.google.com) com estas colunas na primeira linha (qualquer ordem, o parser identifica pelo nome):

| Data | Horário | Título | Local | Status |
|---|---|---|---|---|
| 17/08/2026 | 20:00 | Show acústico — Bar do Vinho | Boa Viagem, Recife/PE | Confirmado |
| 25/08/2026 | | Festival de Inverno | Garanhuns/PE | |
| 30/08/2026 | 21:00 | Show cancelado | Olinda/PE | Cancelado |

- **Data**: `DD/MM/AAAA` (ex.: `17/08/2026`) — também aceita `AAAA-MM-DD`.
- **Horário**: `HH:MM`. Em branco = evento de dia inteiro.
- **Status**: em branco ou `Confirmado` = aparece no site. `Cancelado` ou `Rascunho` = fica oculto sem apagar a linha.
- Eventos com data passada somem automaticamente da lista.

**b) Publique como CSV**: **Arquivo → Compartilhar → Publicar na Web** → selecione a aba → formato **CSV** → **Publicar**. Copie o link gerado (termina em `output=csv`).

**c) Configure a variável de ambiente** (ver seção 3).

A rota `/api/agenda.js` busca o CSV, filtra por data futura e status, ordena, e devolve os próximos shows já tratados para o componente `Agenda.jsx`. Um cache simples em memória de 5 minutos evita bater na planilha a cada carregamento de página.

> **Nota técnica:** a extensão `next: { revalidate }` do `fetch`, comum em exemplos de cache do Next.js, é pensada para o App Router e se mostrou instável dentro de uma API Route do Pages Router neste projeto (testado e confirmado: retornava erro de fetch mesmo com a URL acessível). Por isso o cache aqui é feito manualmente com uma variável em memória — mais simples, mais previsível, e sem depender de comportamento não documentado para esse cenário.

---

## 3. Variáveis de ambiente (produção — Vercel)

No painel do projeto: **Settings → Environment Variables**

| Nome | Valor |
|---|---|
| `GOOGLE_SHEETS_CSV_URL` | Link CSV publicado da planilha (passo 2b) |

Sem essa variável, a rota devolve automaticamente uma agenda de demonstração — o site nunca fica com a seção quebrada ou vazia por falta de configuração.

> **Sobre o formulário de contato (seção 6):** ele continua usando o FormSubmit por enquanto. Essa peça está em avaliação — se a decisão for trocar por algo que não dependa de um serviço terceiro (ex.: uma rota serverless própria com um provedor de e-mail transacional, ou Google Apps Script), essa seção é atualizada junto.

---

## 4. Fotos da galeria

Edite o array `FOTOS` em `components/Gallery.jsx` e salve os arquivos correspondentes em `public/images/galeria/`. O grid e o efeito de zoom (`group-hover:scale-105`) se ajustam automaticamente ao número de fotos.

## 5. Imagem do Hero

Salve a imagem de fundo em `public/images/hero-mobile-eberson.webp` (referenciada em `components/Hero.jsx`). Recomendado: WebP, ~1600px de largura, otimizado (ex.: squoosh.app).

---

## 6. Formulário de contratação

Usa [FormSubmit](https://formsubmit.co/) (sem backend próprio). Em `components/BookingForm.jsx`:

```js
const WHATSAPP_NUMERO = "5581900000000";     // 55 + DDD + número
const FORMSUBMIT_EMAIL = "seu-email@dominio.com";
```

No primeiro envio de teste, o FormSubmit manda um e-mail de confirmação — clique no link para ativar o endpoint.

---

## 7. Deploy contínuo na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório (o framework Next.js é detectado automaticamente).
3. Configure `GOOGLE_SHEETS_CSV_URL` em Environment Variables antes do primeiro deploy.
4. Cada push na branch principal gera um deploy de produção automático.

---

## Validação feita neste projeto

- `npm run build` → compila sem erros (`✓ Compiled successfully`)
- `npm run start` + `curl /api/agenda` sem `GOOGLE_SHEETS_CSV_URL` → confirma que o fallback de demonstração funciona sem configuração
- Teste ponta a ponta com uma planilha simulada (CSV servido localmente) cobrindo: campo com vírgula dentro de aspas, cabeçalho com acento, linha vazia, evento com data passada (deve sumir), evento com Status "Cancelado" (deve sumir), Status em branco (deve aparecer), Status "confirmado" em minúsculo (deve aparecer), e ordenação por data — todos os casos passaram
- Confirmado que o cache em memória funciona (segunda chamada retorna `source: "google-sheets-cache"`)
- Todas as seções obrigatórias do briefing estão presentes: Header fixo, Hero fullscreen, Agenda integrada, Galeria com zoom, Formulário B2B, Footer
