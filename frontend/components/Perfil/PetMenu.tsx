import Image from "next/image";

type Pet = {
  id: string;
  nome: string;
  foto: string;
};

type PetMenuProps = {
  pets: Pet[];
  petSelecionado: number;
  onSelect: (index: number) => void;
  onAdicionar: () => void;
};

export default function PetMenu({
  pets,
  petSelecionado,
  onSelect,
  onAdicionar
}: PetMenuProps) {
  function getFotoUrl(foto: string) {
    return foto.startsWith("http")
      ? foto
      : `${process.env.NEXT_PUBLIC_API_URL}${foto}`;
  }

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">

        <h2 className="font-bold text-[var(--secondary)] mb-1">
          Meus pets 🐾
        </h2>

        <p className="text-xs text-gray-500 mb-4">
          Selecione um animal
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
          {pets.map((pet, index) => (
            <button
              key={pet.id}
              onClick={() => onSelect(index)}
              className={`min-w-40 flex items-center gap-3 p-3 rounded-xl text-left transition lg:w-full ${petSelecionado === index
                ? "bg-[var(--secondary)]/10 border border-[var(--secondary)]/30"
                : "hover:bg-gray-50 border border-transparent"
                }`}
            >
              <Image
                src={getFotoUrl(pet.foto)}
                alt={pet.nome}
                width={200}
                height={200}
                unoptimized
                className="w-12 h-12 rounded-full object-cover"
              />


              <p className="font-semibold text-[var(--secondary)]">
                {pet.nome}
              </p>


              {petSelecionado === index && (
                <span className="ml-auto text-[var(--secondary)]">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        <button type="button" onClick={onAdicionar} className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-[var(--primary)]/30 text-[var(--primary)] text-sm font-semibold">
          + Adicionar pet
        </button>

      </div>
    </aside>
  );
}
