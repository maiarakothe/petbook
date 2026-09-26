"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PetMenu from "@/components/Perfil/PetMenu";
import PetProfile from "@/components/Perfil/PetProfile";
import UserProfile from "@/components/Perfil/UserProfile";
import PetDialog from "@/components/Perfil/PetDialog";


import { createPet, getPets, updatePet } from "@/api/pets";
import { updateProfile, type Usuario } from "@/api/auth";
import {
  getMinhasPublicacoes,
  Publicacao,
} from "@/api/publicacoes";
import UserDialog from "@/components/Perfil/UserDialog";

type Pet = {
  id: string;
  nome: string;
  foto: string;
  raca: string;
  tipo_animal: string;
  idade: string;
  localizacao: string;
  publicacoes?: number;
};

export default function PerfilPage() {
  const router = useRouter();
  const [petSelecionado, setPetSelecionado] = useState(0);
  const [dialogPetAberto, setDialogPetAberto] = useState(false);
  const [dialogUsuarioAberto, setDialogUsuarioAberto] = useState(false);
  const [petEmEdicao, setPetEmEdicao] = useState<Pet | null>(null);

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      const token = localStorage.getItem("petbook_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const usuarioSalvo =
          localStorage.getItem("petbook_usuario");

        if (usuarioSalvo) {
          setUsuario(JSON.parse(usuarioSalvo));
        }

        const [petsData, publicacoesData] = await Promise.all([
          getPets(),
          getMinhasPublicacoes(),
        ]);

        setPets(petsData);
        setPublicacoes(publicacoesData);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.toLowerCase().includes("token")) {
            localStorage.removeItem("petbook_token");
            localStorage.removeItem("petbook_usuario");
            router.replace("/login");
            return;
          }
          setErro(error.message);
        } else {
          setErro("Erro ao carregar perfil.");
        }
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [router]);

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
          <UserProfile
            usuario={usuario}
            quantidadePublicacoes={publicacoes.length}
            onEditar={() => setDialogUsuarioAberto(true)}
            onSair={() => {
              localStorage.removeItem("petbook_token");
              localStorage.removeItem("petbook_usuario");
              router.replace("/login");
            }}
          />
        )}

        {usuario && dialogUsuarioAberto && (
          <UserDialog
            aberto
            usuario={usuario}
            onClose={() => setDialogUsuarioAberto(false)}
            onSalvar={async (dados: Pick<Usuario, "nome" | "email">) => {
              const usuarioAtualizado = await updateProfile(dados);
              localStorage.setItem("petbook_usuario", JSON.stringify(usuarioAtualizado));
              setUsuario(usuarioAtualizado);
              setDialogUsuarioAberto(false);
            }}
          />
        )}

        <div className="flex gap-6">

          <PetMenu
            pets={pets}
            petSelecionado={petSelecionado}
            onSelect={setPetSelecionado}
            onAdicionar={() => {
              setPetEmEdicao(null);
              setDialogPetAberto(true)
            }}
          />

          {pets.length > 0 && (
            <PetProfile
              pet={pets[petSelecionado]}
              publicacoes={publicacoes.filter(
                (publicacao) => publicacao.pet.id === pets[petSelecionado].id,
              )}
              onEditar={() => {
                setPetEmEdicao(pets[petSelecionado]);
                setDialogPetAberto(true);
              }}
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

          {dialogPetAberto && (
            <PetDialog
              key={petEmEdicao?.id ?? "novo"}
              aberto
              pet={petEmEdicao}
              onClose={() => setDialogPetAberto(false)}
              onSalvar={async (pet) => {
                try {
                  if (petEmEdicao) {
                    const petAtualizado = await updatePet(petEmEdicao.id, pet);
                    setPets((petsAtuais) => petsAtuais.map((petAtual) =>
                      petAtual.id === petAtualizado.id ? petAtualizado : petAtual,
                    ));
                    alert("Pet atualizado com sucesso!");
                  } else {
                    const novoPet = await createPet(pet);

                    setPets((petsAtuais) => [
                      ...petsAtuais,
                      novoPet,
                    ]);

                    setPetSelecionado(pets.length);

                    alert("Pet cadastrado com sucesso!");
                  }

                  setDialogPetAberto(false);
                  setPetEmEdicao(null);
                } catch (error) {
                  if (error instanceof Error) {
                    alert(error.message);
                  } else {
                    alert("Erro ao cadastrar pet.");
                  }
                }
              }}
            />
          )}

        </div>
      </div>
    </main>
  );
}
