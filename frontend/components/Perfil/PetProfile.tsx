import Image from "next/image";

type Pet = {
  nome: string;
  username: string;
  tipo: string;
  raca: string;
  localizacao: string;
  idade: string;
  publicacoes: number;
  foto: string;
};

type PetProfileProps = {
  pet: Pet;
};

export default function PetProfile({ pet }: PetProfileProps) {
  return (
    <section className="flex-1 min-w-0">

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">

        <div className="p-8">

          <div className="flex items-start gap-6">

            <Image
              src={pet.foto}
              alt={pet.nome}
              width={200}
              height={200}
              className="w-32 h-32 rounded-full object-cover"
            />

            <div className="flex-1">

              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[var(--secondary)]">
                    {pet.nome}
                  </h1>

                  <p className="text-gray-500">
                    {pet.username}
                  </p>
                </div>

                <button className="ml-auto px-5 py-2 rounded-xl bg-[var(--primary)] text-white font-semibold">
                  Editar pet
                </button>
              </div>

              <div className="flex gap-8 mt-6">

                <div>
                  <strong className="text-[var(--secondary)]">
                    {pet.publicacoes}
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
              🐾 {pet.tipo}
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

          <div className="grid grid-cols-3 gap-3">

            <div className="aspect-square bg-gray-100 rounded-xl" />
            <div className="aspect-square bg-gray-100 rounded-xl" />
            <div className="aspect-square bg-gray-100 rounded-xl" />

          </div>

        </div>

      </div>

    </section>
  );
}