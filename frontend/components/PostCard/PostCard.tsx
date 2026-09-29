"use client";

import styles from "./PostCard.module.css";

import Image from "next/image";

import { MessageCircle, Heart } from "lucide-react";

import { useEffect, useState } from "react";

import {
  curtirPublicacao,
  descurtirPublicacao,
  getCurtidasPublicacao,
} from "@/api/publicacoes";
import { API_URL } from "@/lib/api";

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
  const [totalCurtidas, setTotalCurtidas] = useState(likes);
  const [carregandoCurtida, setCarregandoCurtida] = useState(true);
  const [alterandoCurtida, setAlterandoCurtida] = useState(false);

  const fotoPerfil = petFoto.startsWith("http")
    ? petFoto
    : `${API_URL}${petFoto}`;

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("petbook_usuario");
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) as { id?: string } : null;
    let ativo = true;

    async function carregarCurtida() {
      if (!usuario?.id) {
        if (ativo) setCarregandoCurtida(false);
        return;
      }

      try {
        const curtidas = await getCurtidasPublicacao(id);
        if (ativo) {
          setCurtido(curtidas.some((curtida) => curtida.usuarioId === usuario.id));
        }
      } catch (error) {
        console.error("Erro ao carregar curtida:", error);
      } finally {
        if (ativo) setCarregandoCurtida(false);
      }
    }

    carregarCurtida();

    return () => {
      ativo = false;
    };
  }, [id]);

  async function alterarCurtida() {
    if (carregandoCurtida || alterandoCurtida) return;

    try {
      setAlterandoCurtida(true);

      if (curtido) {
        await descurtirPublicacao(id);
        setCurtido(false);
        setTotalCurtidas((total) => total - 1);
      } else {
        await curtirPublicacao(id);
        setCurtido(true);
        setTotalCurtidas((total) => total + 1);
      }
    } catch (error) {
      console.error("Erro ao alterar curtida:", error);
    } finally {
      setAlterandoCurtida(false);
    }
  }

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
            {petFoto ? (
              <Image
                src={fotoPerfil}
                alt={`Foto de perfil de ${petName}`}
                width={42}
                height={42}
                className={styles.avatarImage}
                unoptimized
              />
            ) : "🐶"}
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
            onClick={alterarCurtida}
            disabled={carregandoCurtida || alterandoCurtida}
            aria-label={curtido ? "Remover curtida" : "Curtir publicação"}
            aria-pressed={curtido}
            className={curtido ? styles.curtido : ""}
          >
            <Heart
              size={22}
              fill={curtido ? "currentColor" : "none"}
            />

            <span>{totalCurtidas}</span>
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
