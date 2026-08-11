import { useEffect, useState } from "react";

const MESES = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
];

export default function Agenda() {
  const [eventos, setEventos] = useState([]);
  const [status, setStatus] = useState("carregando"); // carregando | ok | vazio | erro
  const [fonte, setFonte] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const resp = await fetch("/api/agenda");
        if (!resp.ok) throw new Error("Falha na resposta da API");
        const data = await resp.json();

        if (!ativo) return;

        setFonte(data.source);
        setEventos(data.eventos || []);
        setStatus(data.eventos?.length ? "ok" : "vazio");
      } catch (err) {
        console.error("Erro ao carregar agenda:", err);
        if (ativo) setStatus("erro");
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <section id="agenda" className="bg-charcoal px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest25 text-brand-light">
          Agenda oficial
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
          Próximos shows
        </h2>
        <p className="max-w-md text-sm text-white/60 mb-10">
          Sincronizada automaticamente com o Google Agenda do artista — todo
          evento marcado com{" "}
          <code className="text-brand-light">#EbersonAoVivo</code> aparece
          aqui em tempo real.
        </p>

        {fonte === "fallback" || fonte === "fallback-error" ? (
          <p className="mb-6 rounded-lg border border-white/10 bg-charcoal-light px-4 py-3 text-xs text-white/50">
            Exibindo agenda de demonstração — configure{" "}
            <code className="text-brand-light">GOOGLE_CALENDAR_ID</code> e{" "}
            <code className="text-brand-light">GOOGLE_API_KEY</code> na Vercel
            para conectar a agenda real.
          </p>
        ) : null}

        {status === "carregando" && <AgendaSkeleton />}

        {status === "erro" && (
          <div className="rounded-xl border border-white/10 bg-charcoal-light px-6 py-10 text-center text-white/60">
            Não foi possível carregar a agenda agora. Tente novamente em
            instantes ou fale direto pelo WhatsApp.
          </div>
        )}

        {status === "vazio" && (
          <div className="rounded-xl border border-white/10 bg-charcoal-light px-6 py-10 text-center text-white/60">
            Nenhum show confirmado no momento. Volte em breve.
          </div>
        )}

        {status === "ok" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventos.map((ev) => (
              <CardEvento key={ev.id} evento={ev} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CardEvento({ evento }) {
  const data = evento.dataISO ? new Date(evento.dataISO) : null;
  const dia = data ? String(data.getDate()).padStart(2, "0") : "--";
  const mes = data ? MESES[data.getMonth()] : "---";
  const horario =
    data && !evento.diaTodo
      ? data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      : "Dia todo";

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-white/10 bg-charcoal-light p-5 hover:border-brand transition-smooth">
      <div className="flex-shrink-0 text-center">
        <span className="block text-2xl font-black text-brand-light leading-none">
          {dia}
        </span>
        <span className="block text-[0.65rem] font-semibold uppercase tracking-wide text-white/40 mt-1">
          {mes}
        </span>
      </div>
      <div className="min-w-0 border-l border-white/10 pl-4">
        <h3 className="truncate text-base font-bold text-white">
          {evento.titulo}
        </h3>
        <p className="mt-1 text-xs text-white/50">{evento.local}</p>
        <p className="mt-1 text-xs text-brand-light">{horario}</p>
      </div>
    </div>
  );
}

function AgendaSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-xl border border-white/10 bg-charcoal-light"
        />
      ))}
    </div>
  );
}
