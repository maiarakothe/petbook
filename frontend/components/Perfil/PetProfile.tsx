import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import type { Publicacao } from "@/api/publicacoes";

type Pet = {
  id: string;
  nome: string;
  tipo_animal: string;
  raca: string;
  localizacao: string;
  idade: string;
  publicacoes?: number;
  foto: string;
};

type PetProfileProps = {
  pet: Pet;
  publicacoes: Publicacao[];
  onEditar: () => void;
  onExcluir: () => void;
  onEditarPublicacao: (publicacao: Publicacao) => void;
  onExcluirPublicacao: (publicacao: Publicacao) => void;
};

export default function PetProfile({ pet, publicacoes, onEditar, onExcluir, onEditarPublicacao, onExcluirPublicacao }: PetProfileProps) {
  const fotoUrl = pet.foto.startsWith("http")
    ? pet.foto
    : `${process.env.NEXT_PUBLIC_API_URL}${pet.foto}`;

  return (
    <section className="flex-1 min-w-0">
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
            <Image
              src={fotoUrl}
              alt={pet.nome}
              width={200}
              height={200}
              unoptimized
              className="w-32 h-32 rounded-full object-cover"
            />

            <div className="w-full flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <h1 className="text-center text-3xl font-bold text-[var(--secondary)] sm:text-left">
                  {pet.nome}
                </h1>

                <div className="flex gap-2 sm:ml-auto">
                  <button type="button" onClick={onEditar} className="flex-1 rounded-xl bg-[var(--primary)] px-4 py-2 font-semibold text-white sm:flex-none">Editar pet</button>
                  <button type="button" onClick={onExcluir} aria-label={`Excluir ${pet.nome}`} className="rounded-xl border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="flex gap-8 mt-6">
                <div>
                  <strong className="text-[var(--secondary)]">
                    {publicacoes.length}
                  </strong>

                  <p className="text-xs text-gray-500">
                    publicações
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[var(--background)] text-sm">
              🐾 {pet.tipo_animal}
            </span>

            <span className="px-3 py-1.5 rounded-full bg-[var(--background)] text-sm">
              🧬 {pet.raca}
            </span>

            <span className="px-3 py-1.5 rounded-full bg-[var(--background)] text-sm">
              🎂 {pet.idade}
            </span>

            <span className="px-3 py-1.5 rounded-full bg-[var(--background)] text-sm">
              📍 {pet.localizacao}
            </span>
          </div>
        </div>

        <div className="border-t border-black/5" />

        <div className="p-5 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[var(--secondary)]">
              Publicações de {pet.nome}
            </h2>

          </div>

          {publicacoes.length === 0 ? (
            <p className="text-sm text-gray-500">Este pet ainda não tem publicações.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {publicacoes.map((publicacao) => {
                const fotoPublicacao = publicacao.foto.startsWith("http")
                  ? publicacao.foto
                  : `${process.env.NEXT_PUBLIC_API_URL}${publicacao.foto}`;

                return <div key={publicacao.id} className="group relative aspect-square overflow-hidden rounded-xl">
                  <Image src={fotoPublicacao} alt={publicacao.legenda || `Publicação de ${pet.nome}`} width={300} height={300} unoptimized className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-end gap-1 bg-black/55 p-2 transition group-hover:translate-y-0 group-focus-within:translate-y-0">
                    <button type="button" onClick={() => onEditarPublicacao(publicacao)} aria-label="Editar publicação" className="rounded-lg bg-white p-2 text-[var(--secondary)]"><Pencil size={16} /></button>
                    <button type="button" onClick={() => onExcluirPublicacao(publicacao)} aria-label="Excluir publicação" className="rounded-lg bg-white p-2 text-red-700"><Trash2 size={16} /></button>
                  </div>
                </div>;
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
