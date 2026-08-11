import { useEffect, useState } from "react";

const LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#agenda", label: "Agenda" },
  { href: "#galeria", label: "Galeria" },
  { href: "#contato", label: "Contato" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth backdrop-blur-md ${
        scrolled ? "bg-charcoal/90 shadow-lg shadow-black/30" : "bg-charcoal/40"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#inicio"
          className="font-black uppercase tracking-widest25 text-sm md:text-base text-white"
        >
          Éberson <span className="text-brand">Ávila</span>
        </a>

        {/* Navegação desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/80 hover:text-brand transition-smooth"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-smooth"
          >
            Contratar
          </a>
        </nav>

        {/* Botão hambúrguer mobile */}
        <button
          type="button"
          className="flex flex-col gap-1.5 md:hidden p-2"
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 bg-white transition-smooth ${
              menuAberto ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-smooth ${
              menuAberto ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-smooth ${
              menuAberto ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`md:hidden overflow-hidden transition-smooth bg-charcoal/95 backdrop-blur-md ${
          menuAberto ? "max-h-72" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 pb-5">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuAberto(false)}
              className="py-3 text-white/85 border-b border-white/10 text-sm"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setMenuAberto(false)}
            className="mt-4 rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Contratar show
          </a>
        </nav>
      </div>
    </header>
  );
}
