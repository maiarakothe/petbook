"use client";

import styles from "./PostCard.module.css";

import Image from "next/image";

import { Star, MessageCircle, Heart } from "lucide-react";

import { useState } from "react";

import { curtirPublicacao, descurtirPublicacao } from "@/api/publicacoes";

interface PostCardProps {
  id: string;
  petName: string;
  petFoto: string;
  type: string;
  image: string;
  caption: string;
  likes: number;
}

export default function PostCard({
  id,
  petName,
  petFoto,
  type,
  image,
  caption,
  likes,
}: PostCardProps) {
  const [curtido, setCurtido] = useState(false);
  const [favorito, setFavorito] = useState(false);

  const tipoClasse =
    type === "Animal Perdido"
      ? styles.perdido
      : type === "Adoção"
        ? styles.adocao
        : "";

  return (
    <article className={`${styles.card} ${tipoClasse}`}>
      <div className={styles.header}>
        <div className={styles.pet}>
          <div className={styles.avatar}>
            🐶
          </div>

          <div>
            <strong>{petName}</strong>
          </div>
        </div>

        <span
          className={`${styles.type} ${
            type === "Animal Perdido"
              ? styles.typePerdido
              : type === "Adoção"
                ? styles.typeAdocao
                : ""
          }`}
        >
          {type}
        </span>
      </div>

      <Image
        src={image}
        alt={`Foto de ${petName}`}
        className={styles.image}
        width={600}
        height={400}
      />

      <div className={styles.content}>
        <p>{caption}</p>

        <div className={styles.actions}>
          
          <button
            type="button"
            onClick={async () => {
              try {
                if (curtido) {
                  await descurtirPublicacao(id);
                } else {
                  await curtirPublicacao(id);
                }

                setCurtido(!curtido);
              } catch (error) {
                console.error("Erro ao alterar curtida:", error);
              }
            }}
            className={curtido ? styles.curtido : ""}
          >
            <Heart
              size={22}
              fill={curtido ? "currentColor" : "none"}
            />

            <span>{likes + (curtido ? 1 : 0)}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setFavorito(!favorito)}
            className={favorito ? styles.favoritado : ""}
          >
            <Star
              size={22}
              fill={favorito ? "currentColor" : "none"}
            />

            <span>24</span>
          </button>

          <button type="button">
            <MessageCircle size={22} />
            <span>8</span>
          </button>
        </div>
      </div>
    </article>
  );
}