"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import CreatePostBox from "@/components/CreatePostBox/CreatePostBox";

import PostCard from "@/components/PostCard/PostCard";

import {
  getPublicacoes,
  Publicacao,
} from "@/api/publicacoes";

export default function Home() {
  const router = useRouter();

  const [publicacoes, setPublicacoes] = useState<
    Publicacao[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("petbook_token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarPublicacoes() {
      try {
        const dados = await getPublicacoes();

        setPublicacoes(dados);
      } catch (error) {
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro("Erro ao carregar publicações.");
        }
      } finally {
        setLoading(false);
      }
    }

    carregarPublicacoes();
  }, [router]);

  return (
    <div>
      <div className="layout">
        <main className="feed">
          <CreatePostBox />

          {loading && (
            <p className="text-center text-gray-500">
              Carregando publicações...
            </p>
          )}

          {erro && (
            <p className="text-center text-red-500">
              {erro}
            </p>
          )}

          {!loading &&
            !erro &&
            publicacoes.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <p>
                  Ainda não existem publicações.
                </p>

                <p className="text-sm mt-1">
                  Seja o primeiro a publicar!
                </p>
              </div>
            )}

          {!loading &&
            publicacoes.map((publicacao) => (
              <PostCard
                key={publicacao.id}
                petName={publicacao.pet.nome}
                type={
                  publicacao.tipo === "COMUM"
                    ? "Publicação"
                    : publicacao.tipo === "ADOCAO"
                      ? "Adoção"
                      : "Animal Perdido"
                }
                image={`${process.env.NEXT_PUBLIC_API_URL}${publicacao.foto}`}
                caption={publicacao.legenda}
              />
            ))}
        </main>
      </div>
    </div>
  );
}