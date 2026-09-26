import Image from "next/image";
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
};

export default function PetProfile({ pet, publicacoes, onEditar }: PetProfileProps) {
  const fotoUrl = pet.foto.startsWith("http")
    ? pet.foto
    : `${process.env.NEXT_PUBLIC_API_URL}${pet.foto}`;

  return (
    <section className="flex-1 min-w-0">
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex items-start gap-6">
            <Image
              src={fotoUrl}
              alt={pet.nome}
              width={200}
              height={200}
              unoptimized
              className="w-32 h-32 rounded-full object-cover"
            />

            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-[var(--secondary)]">
                  {pet.nome}
                </h1>

                <button
                  type="button"
                  onClick={onEditar}
                  className="ml-auto px-5 py-2 rounded-xl bg-[var(--primary)] text-white font-semibold"
                >
                  Editar pet
                </button>
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

          <div className="flex gap-2 mt-7">
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

        <div className="p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[var(--secondary)]">
              Publicações de {pet.nome}
            </h2>

            <button className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold">
              + Publicar
            </button>
          </div>

          {publicacoes.length === 0 ? (
            <p className="text-sm text-gray-500">Este pet ainda não tem publicações.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {publicacoes.map((publicacao) => {
                const fotoPublicacao = publicacao.foto.startsWith("http")
                  ? publicacao.foto
                  : `${process.env.NEXT_PUBLIC_API_URL}${publicacao.foto}`;

                return (
                  <Image
                    key={publicacao.id}
                    src={fotoPublicacao}
                    alt={publicacao.legenda || `Publicação de ${pet.nome}`}
                    width={300}
                    height={300}
                    unoptimized
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}