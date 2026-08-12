/**
 * /api/agenda
 *
 * Rota serverless responsável por buscar os próximos shows diretamente
 * do Google Agenda do artista.
 *
 * Regra de negócio:
 * - O artista gerencia a agenda pelo próprio app do Google Agenda no celular.
 * - Todo evento que for um show público/contratado deve conter a tag
 *   `#EbersonAoVivo` no título ou na descrição.
 * - Esta rota busca apenas eventos futuros (timeMin = agora), filtra pela tag,
 *   remove a tag do título exibido, e devolve um JSON limpo para o front-end.
 *
 * Variáveis de ambiente necessárias (configuradas na Vercel):
 * - GOOGLE_CALENDAR_ID
 * - GOOGLE_API_KEY
 *
 * Se as variáveis não estiverem configuradas (ex.: ambiente de staging/preview
 * sem segredos), a rota devolve dados de demonstração para não quebrar a UI.
 */

const TAG_FILTRO = "#EbersonAoVivo";
const MAX_EVENTOS = 8;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Método não permitido." });
  }

  const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
  const API_KEY = process.env.GOOGLE_API_KEY;

  // Sem credenciais configuradas -> devolve dados de demonstração
  if (!CALENDAR_ID || !API_KEY) {
    return res.status(200).json({
      source: "fallback",
      eventos: dadosDemonstracao(),
    });
  }

  try {
    const timeMin = new Date().toISOString();
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        CALENDAR_ID
      )}/events`
    );
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("timeMin", timeMin);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("maxResults", "50");

    const googleResp = await fetch(url.toString(), {
      // cache curto no lado do servidor: evita bater na API do Google
      // a cada requisição, mas mantém a agenda praticamente em tempo real.
      next: { revalidate: 300 },
    });

    if (!googleResp.ok) {
      throw new Error(`Google Calendar API respondeu ${googleResp.status}`);
    }

    const data = await googleResp.json();
    const itens = Array.isArray(data.items) ? data.items : [];

    const eventosFiltrados = itens
      .filter((ev) => {
        const texto = `${ev.summary || ""} ${ev.description || ""}`;
        return texto.includes(TAG_FILTRO);
      })
      .slice(0, MAX_EVENTOS)
      .map(sanitizarEvento);

    return res.status(200).json({
      source: "google-calendar",
      eventos: eventosFiltrados,
    });
  } catch (err) {
    console.error("Erro ao consultar Google Calendar:", err.message);
    // Falha na chamada externa -> ainda assim devolve algo utilizável
    return res.status(200).json({
      source: "fallback-error",
      eventos: dadosDemonstracao(),
    });
  }
}

function sanitizarEvento(ev) {
  const inicioBruto = ev.start?.dateTime || ev.start?.date;
  const dataInicio = inicioBruto ? new Date(inicioBruto) : null;

  return {
    id: ev.id,
    titulo: limparTag(ev.summary || "Show"),
    local: ev.location || "Local a confirmar",
    dataISO: dataInicio ? dataInicio.toISOString() : null,
    diaTodo: !ev.start?.dateTime,
  };
}

function limparTag(texto) {
  return texto
    .replace(new RegExp(TAG_FILTRO, "gi"), "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function dadosDemonstracao() {
  const hoje = new Date();
  const soma = (dias) =>
    new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: "demo-1",
      titulo: "Show acústico — Bar do Vinho",
      local: "Boa Viagem, Recife/PE",
      dataISO: soma(6),
      diaTodo: false,
    },
    {
      id: "demo-2",
      titulo: "Casamento Ana & João",
      local: "Espaço Jardins, Olinda/PE",
      dataISO: soma(14),
      diaTodo: false,
    },
    {
      id: "demo-3",
      titulo: "Festival de Inverno de Garanhuns",
      local: "Praça Central, Garanhuns/PE",
      dataISO: soma(29),
      diaTodo: true,
    },
  ];
}
