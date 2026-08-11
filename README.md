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

## 2. Conectar a Agenda ao Google Agenda real

**Regra de negócio:** o artista continua usando o Google Agenda normalmente pelo celular. Todo evento que deve aparecer no site precisa conter a tag **`#EbersonAoVivo`** no título ou na descrição.

### Passo a passo

1. **Crie uma agenda dedicada** (recomendado) em [calendar.google.com](https://calendar.google.com) — mais fácil de deixar pública sem expor a rotina pessoal do artista.
2. **Torne-a pública**: Configurações da agenda → Permissões de acesso → "Disponibilizar publicamente".
3. **Copie o ID da agenda**: mesma tela → "Integrar agenda" → *ID da agenda* (formato `algumacoisa@group.calendar.google.com`).
4. **Crie uma chave de API** no [Google Cloud Console](https://console.cloud.google.com/):
   - Ative a **Google Calendar API**.
   - Em Credenciais → Criar credenciais → Chave de API.
   - **Restrinja a chave por IP** (não por referenciador HTTP, já que a chamada acontece no servidor da Vercel, não no navegador do visitante) — ou deixe sem restrição de IP e apenas restrinja por API (Calendar API) se a Vercel não expuser IPs fixos no seu plano.
5. **Marcar um show**: crie o evento no Google Agenda com título, data, horário e local, incluindo a tag em qualquer lugar do título ou da descrição — ex.: `Casamento Ana & João #EbersonAoVivo`.
6. A rota `/api/agenda` busca eventos futuros, filtra pela tag, remove a tag do texto exibido e devolve um JSON limpo pro componente `Agenda.jsx`.

---

## 3. Variáveis de ambiente (produção — Vercel)

No painel do projeto: **Settings → Environment Variables**

| Nome | Valor |
|---|---|
| `GOOGLE_CALENDAR_ID` | ID da agenda pública |
| `GOOGLE_API_KEY` | Chave de API do Google Cloud |

Sem essas variáveis, a rota devolve automaticamente uma agenda de demonstração — o site nunca fica com a seção quebrada ou vazia por falta de configuração.

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
3. Configure `GOOGLE_CALENDAR_ID` e `GOOGLE_API_KEY` em Environment Variables antes do primeiro deploy.
4. Cada push na branch principal gera um deploy de produção automático.

---

## Validação feita neste projeto

- `npm run build` → compila sem erros (`✓ Compiled successfully`)
- `npm run start` + `curl /api/agenda` → confirma que o fallback de demonstração funciona sem credenciais configuradas
- Todas as seções obrigatórias do briefing estão presentes: Header fixo, Hero fullscreen, Agenda integrada, Galeria com zoom, Formulário B2B, Footer
