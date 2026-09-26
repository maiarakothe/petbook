"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard/PostCard";
import { getPublicacoes, Publicacao } from "@/api/publicacoes";

export default function PerdidosPage() {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    getPublicacoes("PERDIDO")
      .then((dados) => setPublicacoes(
        dados.filter((publicacao) => publicacao.tipo === "PERDIDO"),
      ))
      .catch((error) => setErro(
        error instanceof Error ? error.message : "Erro ao carregar animais perdidos.",
      ));
  }, []);

  return (
    <main className="layout">
      <section className="feed">
        <h1 className="mb-6 text-2xl font-bold text-[var(--secondary)]">
          Animais perdidos
        </h1>
        {erro && <p className="text-red-500">{erro}</p>}
        {!erro && publicacoes.length === 0 && (
          <p className="text-gray-500">Nenhum animal perdido no momento.</p>
        )}
        {publicacoes.map((publicacao) => (
          <PostCard
            key={publicacao.id}
            petName={publicacao.pet.nome}
            petFoto={publicacao.pet.foto}
            type="Animal Perdido"
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
