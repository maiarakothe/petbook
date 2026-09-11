"use client";

import { useState } from "react";
import PetMenu from "@/components/Perfil/PetMenu";
import PetProfile from "@/components/Perfil/PetProfile";
import UserProfile from "@/components/Perfil/UserProfile";


export default function PerfilPage() {
  const [petSelecionado, setPetSelecionado] = useState(0);

  const usuario = {
    nome: 'teste',
    email: 'teste@gmail.com'
  };

  const pets = [
    {
      nome: "Mel",
      username: "@mel_pet",
      tipo: "Cachorro",
      raca: "Golden Retriever",
      localizacao: 'jj',
      idade: "3 anos",
      publicacoes: 18,
      foto: "",
    },
    {
      nome: "Thor",
      username: "@thor_pet",
      tipo: "Gato",
      raca: "Siamês",
      localizacao: '',
      idade: "2 anos",
      publicacoes: 9,
      foto: "",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <UserProfile usuario={usuario} />
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