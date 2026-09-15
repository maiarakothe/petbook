"use client";

import { useState } from "react";
import PetMenu from "@/components/Perfil/PetMenu";
import PetProfile from "@/components/Perfil/PetProfile";
import UserProfile from "@/components/Perfil/UserProfile";
import PetDialog from "@/components/Perfil/PetDialog";


export default function PerfilPage() {
  const [petSelecionado, setPetSelecionado] = useState(0);
  const [dialogPetAberto, setDialogPetAberto] = useState(false);

  const usuario = {
    nome: 'teste',
    email: 'teste@gmail.com'
  };

  const pets = [
    {
      nome: "Mel",
      tipo: "Cachorro",
      raca: "Golden Retriever",
      localizacao: 'jj',
      idade: "3 anos",
      publicacoes: 18,
      foto: "",
    },
    {
      nome: "Thor",
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
            onAdicionar={() => setDialogPetAberto(true)}
          />

          <PetProfile pet={pets[petSelecionado]} />
          <PetDialog
            aberto={dialogPetAberto}
            onClose={() => setDialogPetAberto(false)}
            onCadastrar={(pet) => {
              console.log("Pet cadastrado:", pet);
            }}
          />
        </div>

      </div>
    </main>
  );
}