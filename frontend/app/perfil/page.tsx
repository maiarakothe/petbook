"use client";

import { useEffect, useState } from "react";

import PetMenu from "@/components/Perfil/PetMenu";
import PetProfile from "@/components/Perfil/PetProfile";
import UserProfile from "@/components/Perfil/UserProfile";
import PetDialog from "@/components/Perfil/PetDialog";

import { createPet, getPets } from "@/api/pets";

type Usuario = {
  id: string;
  nome: string;
  email: string;
};

type Pet = {
  id: string;
  nome: string;
  foto: string;
  raca: string;
  tipo_animal: string;
  idade: number;
  localizacao: string;
  publicacoes?: number;
};

export default function PerfilPage() {
  const [petSelecionado, setPetSelecionado] = useState(0);
  const [dialogPetAberto, setDialogPetAberto] = useState(false);

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const usuarioSalvo =
          localStorage.getItem("petbook_usuario");

        if (usuarioSalvo) {
          setUsuario(JSON.parse(usuarioSalvo));
        }

        const petsData = await getPets();

        setPets(petsData);
      } catch (error) {
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro("Erro ao carregar perfil.");
        }
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <p>Carregando perfil...</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <p className="text-red-500">{erro}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {usuario && (
          <UserProfile usuario={usuario} />
        )}

        <div className="flex gap-6">

          <PetMenu
            pets={pets}
            petSelecionado={petSelecionado}
            onSelect={setPetSelecionado}
            onAdicionar={() =>
              setDialogPetAberto(true)
            }
          />

          {pets.length > 0 && (
            <PetProfile
              pet={pets[petSelecionado]}
            />
          )}

          {pets.length === 0 && (
            <section className="flex-1 bg-white rounded-2xl p-10 text-center">
              <h2 className="text-xl font-bold text-[var(--secondary)]">
                Você ainda não possui pets
              </h2>

              <p className="mt-2 text-gray-500">
                Cadastre seu primeiro animalzinho!
              </p>
            </section>
          )}

          <PetDialog
            aberto={dialogPetAberto}
            onClose={() =>
              setDialogPetAberto(false)
            }
            onCadastrar={async (pet) => {
              try {
                const novoPet = await createPet(pet);

                setPets((petsAtuais) => [
                  ...petsAtuais,
                  novoPet,
                ]);

                setPetSelecionado(pets.length);

                alert("Pet cadastrado com sucesso!");

                setDialogPetAberto(false);
              } catch (error) {
                if (error instanceof Error) {
                  alert(error.message);
                } else {
                  alert("Erro ao cadastrar pet.");
                }
              }
            }}
          />

        </div>
      </div>
    </main>
  );
}