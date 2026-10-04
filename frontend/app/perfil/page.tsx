"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import PetMenu from "@/components/Perfil/PetMenu";
import PetProfile from "@/components/Perfil/PetProfile";
import UserProfile from "@/components/Perfil/UserProfile";
import PetDialog from "@/components/Perfil/PetDialog";


import { createPet, deletePet, getPets, updatePet, type Pet } from "@/api/pets";
import { updateProfile, type Usuario } from "@/api/auth";
import {
  getMinhasPublicacoes,
  deletePublicacao,
  updatePublicacao,
  Publicacao,
} from "@/api/publicacoes";
import UserDialog from "@/components/Perfil/UserDialog";
import PostDialog from "@/components/Perfil/PostDialog";
import { useSnackbar } from "@/components/Feedback/SnackbarProvider";

export default function PerfilPage() {
  const router = useRouter();
  const { notify } = useSnackbar();
  const deletingRef = useRef(false);
  const [petSelecionado, setPetSelecionado] = useState(0);
  const [dialogPetAberto, setDialogPetAberto] = useState(false);
  const [dialogUsuarioAberto, setDialogUsuarioAberto] = useState(false);
  const [petEmEdicao, setPetEmEdicao] = useState<Pet | null>(null);
  const [publicacaoEmEdicao, setPublicacaoEmEdicao] = useState<Publicacao | null>(null);

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
        notify(error instanceof Error ? error.message : "Não foi possível carregar seu perfil.", "error");
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [router, notify]);

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
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">

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
              notify("Informações da conta atualizadas com sucesso.");
            }}
          />
        )}

        <div className="flex flex-col gap-6 lg:flex-row">

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
              onExcluir={async () => {
                if (deletingRef.current) return;
                if (!confirm(`Excluir ${pets[petSelecionado].nome} e todas as suas publicações?`)) return;
                deletingRef.current = true;
                try {
                  const id = pets[petSelecionado].id;
                  await deletePet(id);
                  setPets((atuais) => atuais.filter((pet) => pet.id !== id));
                  setPublicacoes((atuais) => atuais.filter((publicacao) => publicacao.pet.id !== id));
                  setPetSelecionado(0);
                  notify("Pet e publicações relacionadas excluídos com sucesso.");
                } catch (error) {
                  notify(error instanceof Error ? error.message : "Não foi possível excluir o pet. Tente novamente.", "error");
                } finally {
                  deletingRef.current = false;
                }
              }}
              onEditarPublicacao={setPublicacaoEmEdicao}
              onExcluirPublicacao={async (publicacao) => {
                if (deletingRef.current) return;
                if (!confirm("Excluir esta publicação?")) return;
                deletingRef.current = true;
                try {
                  await deletePublicacao(publicacao.id);
                  setPublicacoes((atuais) => atuais.filter((item) => item.id !== publicacao.id));
                  notify("Publicação excluída com sucesso.");
                } catch (error) {
                  notify(error instanceof Error ? error.message : "Não foi possível excluir a publicação. Tente novamente.", "error");
                } finally {
                  deletingRef.current = false;
                }
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
                    notify("Pet atualizado com sucesso.");
                  } else {
                    const novoPet = await createPet(pet);

                    setPets((petsAtuais) => [
                      ...petsAtuais,
                      novoPet,
                    ]);

                    setPetSelecionado(pets.length);

                    notify("Pet cadastrado com sucesso.");
                  }

                  setDialogPetAberto(false);
                  setPetEmEdicao(null);
                } catch (error) {
                  notify(error instanceof Error ? error.message : "Não foi possível salvar o pet. Confira os dados e tente novamente.", "error");
                }
              }}
            />
          )}

          {publicacaoEmEdicao && (
            <PostDialog publicacao={publicacaoEmEdicao} onClose={() => setPublicacaoEmEdicao(null)} onSalvar={async (dados) => {
              try {
                const atualizada = await updatePublicacao(publicacaoEmEdicao.id, dados);
                setPublicacoes((atuais) => atuais.map((item) => item.id === atualizada.id ? { ...item, ...atualizada } : item));
                setPublicacaoEmEdicao(null);
                notify("Publicação atualizada com sucesso.");
              } catch (error) {
                notify(error instanceof Error ? error.message : "Não foi possível atualizar a publicação. Tente novamente.", "error");
              }
            }} />
          )}

        </div>
      </div>
    </main>
  );
}
