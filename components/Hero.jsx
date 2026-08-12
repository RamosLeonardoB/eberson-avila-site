export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-mobile-eberson.webp')" }}
      />
      {/* Overlay escuro para legibilidade */}
      <div className="absolute inset-0 bg-charcoal/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="mb-4 text-xs md:text-sm font-semibold uppercase tracking-widest25 text-brand-light">
          xMúsica ao vivo · Pernambuco
        </p>
        <h1 className="font-black uppercase leading-[0.95] text-white text-5xl sm:text-6xl md:text-8xl">
          Éberson
          <br />
          <span className="text-brand">Ávila</span>
        </h1>
        <p className="mt-6 max-w-md text-sm md:text-base text-white/75">
          Cantor, instrumentista e compositor pernambucano. Voz e violão para
          casamentos, eventos corporativos e shows públicos.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row gap-4">
          <a
            href="#contato"
            className="rounded-full bg-brand px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-dark transition-smooth text-center"
          >
            Contratar para evento
          </a>
          <a
            href="#agenda"
            className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:border-brand hover:text-brand transition-smooth text-center"
          >
            Ver próximos shows
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <span className="block h-9 w-5 rounded-full border-2 border-white/40">
          <span className="mx-auto mt-1.5 block h-2 w-1 rounded-full bg-brand" />
        </span>
      </div>
    </section>
  );
}
