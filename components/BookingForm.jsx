import { useState } from "react";

const TIPOS_EVENTO = [
  { value: "", label: "Selecione o tipo de evento", disabled: true },
  { value: "particular", label: "Particular (casamento, aniversário, festa)" },
  { value: "corporativo", label: "Corporativo" },
  { value: "publico", label: "Público (prefeitura, festival, casa de shows)" },
];

const WHATSAPP_NUMERO = "5581900000000"; // 55 + DDD + número
const FORMSUBMIT_EMAIL = "leosomar77@gmail.com";

export default function BookingForm() {
  const [enviando, setEnviando] = useState(false);
  const [nota, setNota] = useState("");

  const acaoConfigurada = !FORMSUBMIT_EMAIL.includes("SEU-EMAIL");
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
    "Olá, Éberson! Sou produtor(a) e quero saber sobre valores e disponibilidade para um evento."
  )}`;

  function handleSubmit(e) {
    if (!acaoConfigurada) {
      e.preventDefault();
      setNota(
        "Formulário ainda não configurado — defina FORMSUBMIT_EMAIL em components/BookingForm.jsx, ou use o WhatsApp ao lado."
      );
      return;
    }
    setEnviando(true);
  }

  return (
    <section id="contato" className="bg-charcoal px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest25 text-brand-light">
          Contratação
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
          Vamos marcar seu evento
        </h2>
        <p className="max-w-md text-sm text-white/60 mb-10">
          Prefeituras, festivais, empresas ou eventos particulares — conte os
          detalhes e o Éberson retorna com proposta e disponibilidade.
        </p>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            action={`https://formsubmit.co/${FORMSUBMIT_EMAIL}`}
            method="POST"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="_subject" value="Novo pedido de show — site Éberson Ávila" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />

            <Campo label="Nome / Produtor(a)">
              <input
                type="text"
                name="Nome"
                required
                autoComplete="name"
                className="campo-input"
              />
            </Campo>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Telefone / WhatsApp">
                <input
                  type="tel"
                  name="Telefone"
                  required
                  autoComplete="tel"
                  placeholder="(81) 9XXXX-XXXX"
                  className="campo-input"
                />
              </Campo>
              <Campo label="E-mail">
                <input
                  type="email"
                  name="Email"
                  required
                  autoComplete="email"
                  className="campo-input"
                />
              </Campo>
            </div>

            <Campo label="Tipo de evento">
              <select name="Tipo de evento" required defaultValue="" className="campo-input">
                {TIPOS_EVENTO.map((t) => (
                  <option key={t.value} value={t.value} disabled={t.disabled}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Campo>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Data prevista">
                <input type="date" name="Data prevista" className="campo-input" />
              </Campo>
              <Campo label="Cidade / Estado">
                <input
                  type="text"
                  name="Cidade/Estado"
                  placeholder="Recife/PE"
                  className="campo-input"
                />
              </Campo>
            </div>

            <Campo label="Observações">
              <textarea
                name="Observacoes"
                rows={4}
                placeholder="Formato desejado (solo, duo, banda), duração, repertório..."
                className="campo-input resize-none"
              />
            </Campo>

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-dark transition-smooth disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Enviar pedido"}
            </button>
            {nota && <p className="text-xs text-brand-light">{nota}</p>}
          </form>

          <div className="flex flex-col gap-6">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#24463B] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#1c3a30] transition-smooth"
            >
              <span className="text-[#4ADE80]">●</span> Chamar no WhatsApp
            </a>

            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li>
                <strong className="text-white">Base:</strong> Recife/PE —
                atende todo o estado
              </li>
              <li>
                <strong className="text-white">Formatos:</strong> Solo (voz e
                violão), duo, banda completa
              </li>
              <li>
                <strong className="text-white">Resposta:</strong> em até 24h
                úteis
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .campo-input {
          width: 100%;
          background-color: #2a2a2a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 0.95rem;
          color: #fff;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .campo-input:focus {
          border-color: #c05454;
        }
      `}</style>
    </section>
  );
}

function Campo({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/50">
      {label}
      {children}
    </label>
  );
}
