import Image from "next/image";

type Pet = {
  nome: string;
  username: string;
  foto: string;
  seguidores: number;
};

type PetMenuProps = {
  pets: Pet[];
  petSelecionado: number;
  onSelect: (index: number) => void;
};

export default function PetMenu({
  pets,
  petSelecionado,
  onSelect,
}: PetMenuProps) {
  return (
    <aside className="w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">

        <h2 className="font-bold text-[var(--secondary)] mb-1">
          Meus pets 🐾
        </h2>

        <p className="text-xs text-gray-500 mb-4">
          Selecione um animal
        </p>

        <div className="space-y-2">
          {pets.map((pet, index) => (
            <button
              key={pet.username}
              onClick={() => onSelect(index)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                petSelecionado === index
                  ? "bg-[var(--secondary)]/10 border border-[var(--secondary)]/30"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <Image
                src={pet.foto}
                alt={pet.nome}
                className="w-12 h-12 rounded-full object-cover"
              />
        

              <div>
                <p className="font-semibold text-[var(--secondary)]">
                  {pet.nome}
                </p>

                <p className="text-xs text-gray-500">
                  {pet.username}
                </p>
              </div>

              {petSelecionado === index && (
                <span className="ml-auto text-[var(--secondary)]">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-[var(--primary)]/30 text-[var(--primary)] text-sm font-semibold">
          + Adicionar pet
        </button>

      </div>
    </aside>
  );
}