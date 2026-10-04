"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Publicacao } from "@/api/publicacoes";

type PostDialogProps = {
  publicacao: Publicacao;
  onClose: () => void;
  onSalvar: (dados: { legenda: string; tipo: string; foto: File | null }) => Promise<void>;
};

export default function PostDialog({ publicacao, onClose, onSalvar }: PostDialogProps) {
  const [legenda, setLegenda] = useState(publicacao.legenda);
  const [tipo, setTipo] = useState(
    publicacao.tipo === "ADOCAO" ? "adocao" : publicacao.tipo === "PERDIDO" ? "perdidos" : "comum",
  );
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState(publicacao.foto);
  const [salvando, setSalvando] = useState(false);
  const savingRef = useRef(false);

  async function salvar() {
    if (savingRef.current) return;
    savingRef.current = true;
    try {
      setSalvando(true);
      await onSalvar({ legenda, tipo, foto });
    } finally {
      savingRef.current = false;
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => {
      if (!salvando) onClose();
    }}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-xl sm:p-7" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--secondary)]">Editar publicação</h2>
            <p className="mt-1 text-sm text-gray-500">Altere o texto, o tipo ou a foto.</p>
          </div>
          <button type="button" onClick={onClose} disabled={salvando} aria-label="Fechar" className="text-2xl text-gray-400 hover:text-[var(--primary)] disabled:opacity-50">×</button>
        </div>

        <label className={`mb-5 block overflow-hidden rounded-2xl bg-[var(--background)] ${salvando ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
          <Image src={preview} alt="Prévia da publicação" width={600} height={360} unoptimized className="h-48 w-full object-cover sm:h-56" />
          <span className="block px-3 py-2 text-center text-sm font-semibold text-[var(--primary)]">Trocar foto</span>
          <input type="file" accept="image/*" disabled={salvando} className="hidden" onChange={(event) => {
            const arquivo = event.target.files?.[0];
            if (!arquivo) return;
            setFoto(arquivo);
            setPreview(URL.createObjectURL(arquivo));
          }} />
        </label>

        <label className="mb-4 block text-sm font-semibold">Tipo
          <select value={tipo} disabled={salvando} onChange={(event) => setTipo(event.target.value)} className="mt-1 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 font-normal outline-none focus:border-[var(--primary)] disabled:opacity-60">
            <option value="comum">Publicação comum</option>
            <option value="adocao">Adoção</option>
            <option value="perdidos">Animal perdido</option>
          </select>
        </label>

        <label className="block text-sm font-semibold">Legenda
          <textarea value={legenda} disabled={salvando} onChange={(event) => setLegenda(event.target.value)} rows={4} className="mt-1 w-full resize-none rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-[var(--primary)] disabled:opacity-60" />
        </label>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={salvando} className="rounded-xl px-5 py-3 font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50">Cancelar</button>
          <button type="button" onClick={salvar} disabled={salvando} className="rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white disabled:opacity-60">{salvando ? "Salvando..." : "Salvar alterações"}</button>
        </div>
      </div>
    </div>
  );
}
