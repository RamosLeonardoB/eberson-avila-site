export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-charcoal px-5 py-10 text-center md:px-8">
      <p className="font-black uppercase tracking-widest25 text-sm text-white">
        Éberson <span className="text-brand">Ávila</span>
      </p>
      <div className="mt-4 flex justify-center gap-6 text-xs text-white/50">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-smooth">
          Instagram
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-smooth">
          YouTube
        </a>
      </div>
      <p className="mt-6 text-[0.7rem] text-white/30">
        &copy; {ano} Éberson Ávila. Todos os direitos reservados.
      </p>
    </footer>
  );
}
