"use client";

import styles from "./PostCard.module.css";

import Image from "next/image";

import { Star, MessageCircle } from "lucide-react";

import { useState } from "react";

interface PostCardProps {
  petName: string;
  petFoto: string;
  type: string;
  image: string;
  caption: string;
}

export default function PostCard({
  petName,
  petFoto,
  type,
  image,
  caption,
}: PostCardProps) {
  const [curtido, setCurtido] = useState(false);

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
            onClick={() => setCurtido(!curtido)}
            className={curtido ? styles.liked : ""}
          >
            <Star
              size={22}
              fill={curtido ? "currentColor" : "none"}
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