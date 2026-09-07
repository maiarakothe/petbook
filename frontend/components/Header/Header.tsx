import Image from "next/image";

export default function Header() {
  return (
    <header className="h-[72px] bg-white border-b border-black/10 flex items-center justify-between px-10">
      
      <Image
        src="/images/logo-lado.png"
        alt="Logo do PetBook"
        width={200}
        height={50}
      />

      <nav className="flex items-center gap-8 h-full">
        
        <a
          href=""
          className="h-full flex items-center gap-2 px-2 text-[var(--primary)] font-semibold border-b-2 border-[var(--primary)]"
        >
          <span>🏠</span>
          <span>Início</span>
        </a>

        <a
          href="/adocao"
          className="flex items-center gap-2 px-2 text-[var(--text-main)] hover:text-[var(--primary)] transition-colors"
        >
          <span>🐶</span>
          <span>Adoção</span>
        </a>

        <a
          href="/perdidos"
          className="flex items-center gap-2 px-2 text-[var(--text-main)] hover:text-[var(--primary)] transition-colors"
        >
          <span>🔎</span>
          <span>Animais perdidos</span>
        </a>

        <a
          href="/perfil"
          className="flex items-center gap-2 px-2 text-[var(--text-main)] hover:text-[var(--primary)] transition-colors"
        >
          <span>👤</span>
          <span>Perfil</span>
        </a>

      </nav>
    </header>
  );
}