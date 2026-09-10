"use client";

import { useState } from "react";
import PetMenu from "@/components/Perfil/PetMenu";
import PetProfile from "@/components/Perfil/PetProfile";


export default function PerfilPage() {
  const [petSelecionado, setPetSelecionado] = useState(0);

  const pets = [
    {
      nome: "Mel",
      username: "@mel_pet",
      tipo: "Cachorro",
      raca: "Golden Retriever",
      idade: "3 anos",
      seguidores: 24,
      seguindo: 18,
      publicacoes: 18,
      foto: "",
    },
    {
      nome: "Thor",
      username: "@thor_pet",
      tipo: "Gato",
      raca: "Siamês",
      idade: "2 anos",
      seguidores: 12,
      seguindo: 9,
      publicacoes: 9,
      foto: "",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex gap-6">
          <PetMenu
            pets={pets}
            petSelecionado={petSelecionado}
            onSelect={setPetSelecionado}
          />

          <PetProfile pet={pets[petSelecionado]} />
        </div>

      </div>
    </main>
  );
}