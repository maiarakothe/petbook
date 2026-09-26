"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard/PostCard";
import { getPublicacoes, Publicacao } from "@/api/publicacoes";

export default function AdocaoPage() {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    getPublicacoes("ADOCAO")
      .then((dados) => setPublicacoes(
        dados.filter((publicacao) => publicacao.tipo === "ADOCAO"),
      ))
      .catch((error) => setErro(
        error instanceof Error ? error.message : "Erro ao carregar adoções.",
      ));
  }, []);

  return (
    <main className="layout">
      <section className="feed">
        <h1 className="mb-6 text-2xl font-bold text-[var(--secondary)]">
          Adoção
        </h1>
        {erro && <p className="text-red-500">{erro}</p>}
        {!erro && publicacoes.length === 0 && (
          <p className="text-gray-500">Nenhum animal para adoção no momento.</p>
        )}
        {publicacoes.map((publicacao) => (
          <PostCard
            key={publicacao.id}
            petName={publicacao.pet.nome}
            petFoto={publicacao.pet.foto}
            type="Adoção"
            image={publicacao.foto.startsWith("http")
              ? publicacao.foto
              : `${process.env.NEXT_PUBLIC_API_URL}${publicacao.foto}`}
            caption={publicacao.legenda}
          />
        ))}
      </section>
    </main>
  );
}
