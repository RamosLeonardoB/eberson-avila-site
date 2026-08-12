import { useState } from "react";

/**
 * Para adicionar uma foto nova:
 * 1. Salve a imagem em /public/images/galeria/
 * 2. Acrescente um objeto ao array FOTOS abaixo
 * Nenhuma outra alteração é necessária — o grid se ajusta sozinho.
 */
const FOTOS = [
  { src: "/images/galeria/show-01.webp", legenda: "Show acústico — Recife" },
  { src: "/images/galeria/show-02.webp", legenda: "Evento corporativo" },
  { src: "/images/galeria/show-03.webp", legenda: "Casamento — Olinda" },
  { src: "/images/galeria/show-04.webp", legenda: "Capa disco" },
  { src: "/images/galeria/show-05.webp", legenda: "Festival de Garanhuns" },
];

export default function Gallery() {
  const [ativa, setAtiva] = useState(null);

  return (
    <section id="galeria" className="bg-charcoal-light px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest25 text-brand-light">
          Registro
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
          Shows públicos e privados
        </h2>
        <p className="max-w-md text-sm text-white/60 mb-10">
          Um retrato dos últimos palcos, de casamentos a grandes eventos.
        </p>

        {FOTOS.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 px-6 py-16 text-center text-sm text-white/40">
            Nenhuma foto publicada ainda. Adicione imagens em{" "}
            <code className="text-brand-light">components/Gallery.jsx</code>.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {FOTOS.map((foto, i) => (
              <button
                key={foto.src}
                type="button"
                onClick={() => setAtiva(foto)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-charcoal"
                aria-label={`Ampliar foto: ${foto.legenda}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${foto.src}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                <span className="absolute bottom-2 left-2 right-2 text-left text-xs text-white opacity-0 group-hover:opacity-100 transition-smooth">
                  {foto.legenda}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {ativa && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setAtiva(null)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-3xl text-white/80 hover:text-brand"
            aria-label="Fechar"
            onClick={() => setAtiva(null)}
          >
            &times;
          </button>
          <div
            className="max-h-[85vh] max-w-3xl overflow-hidden rounded-xl bg-cover bg-center aspect-[4/5] w-full"
            style={{ backgroundImage: `url('${ativa.src}')` }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
