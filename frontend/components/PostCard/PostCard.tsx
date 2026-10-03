"use client";

import styles from "./PostCard.module.css";

import Image from "next/image";

import { MessageCircle, Heart, Pencil, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

import {
  curtirPublicacao,
  descurtirPublicacao,
  getCurtidasPublicacao,
  atualizarComentario,
  Comentario,
  criarComentario,
  excluirComentario,
  getComentarios,
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
  commentCount: number;
}

export default function PostCard({
  id,
  petName,
  petFoto,
  type,
  image,
  caption,
  likes,
  commentCount,
}: PostCardProps) {
  const [curtido, setCurtido] = useState(false);
  const [totalCurtidas, setTotalCurtidas] = useState(likes);
  const [carregandoCurtida, setCarregandoCurtida] = useState(true);
  const [alterandoCurtida, setAlterandoCurtida] = useState(false);
  const [comentariosAbertos, setComentariosAbertos] = useState(false);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [totalComentarios, setTotalComentarios] = useState(commentCount);
  const [carregandoComentarios, setCarregandoComentarios] = useState(false);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");
  const [comentarioEmEdicao, setComentarioEmEdicao] = useState<string | null>(null);
  const [textoEdicao, setTextoEdicao] = useState("");
  const [erroComentario, setErroComentario] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

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

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("petbook_usuario");
    if (!usuarioSalvo) {
      return;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo) as { id?: string };
      queueMicrotask(() => setUsuarioId(usuario.id ?? null));
    } catch (error) {
      console.error("Erro ao identificar usuário dos comentários:", error);
    }
  }, []);

  async function alternarComentarios() {
    if (comentariosAbertos) {
      setComentariosAbertos(false);
      return;
    }

    setComentariosAbertos(true);
    setCarregandoComentarios(true);
    setErroComentario("");

    try {
      const dados = await getComentarios(id);
      setComentarios(dados);
      setTotalComentarios(dados.length);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
      setErroComentario(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os comentários.",
      );
    } finally {
      setCarregandoComentarios(false);
    }
  }

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

  async function enviarComentario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!textoComentario.trim() || enviandoComentario) return;

    try {
      setEnviandoComentario(true);
      setErroComentario("");
      const comentario = await criarComentario(id, textoComentario);
      setComentarios((atuais) => [...atuais, comentario]);
      setTotalComentarios((total) => total + 1);
      setTextoComentario("");
    } catch (error) {
      setErroComentario(
        error instanceof Error
          ? error.message
          : "Não foi possível publicar o comentário.",
      );
    } finally {
      setEnviandoComentario(false);
    }
  }

  async function salvarEdicao(comentarioId: string) {
    if (!textoEdicao.trim()) return;

    try {
      setErroComentario("");
      const comentarioAtualizado = await atualizarComentario(
        id,
        comentarioId,
        textoEdicao,
      );
      setComentarios((atuais) =>
        atuais.map((comentario) =>
          comentario.id === comentarioId ? comentarioAtualizado : comentario,
        ),
      );
      setComentarioEmEdicao(null);
      setTextoEdicao("");
    } catch (error) {
      setErroComentario(
        error instanceof Error
          ? error.message
          : "Não foi possível editar o comentário.",
      );
    }
  }

  async function removerComentario(comentarioId: string) {
    if (!window.confirm("Deseja excluir este comentário?")) return;

    try {
      setErroComentario("");
      await excluirComentario(id, comentarioId);
      setComentarios((atuais) =>
        atuais.filter((comentario) => comentario.id !== comentarioId),
      );
      setTotalComentarios((total) => Math.max(0, total - 1));
    } catch (error) {
      setErroComentario(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o comentário.",
      );
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
          
          <button
            type="button"
            onClick={alternarComentarios}
            aria-expanded={comentariosAbertos}
            aria-label={
              comentariosAbertos
                ? "Ocultar comentários"
                : "Ver comentários"
            }
          >
            <MessageCircle size={22} />
            <span>{totalComentarios}</span>
          </button>
        </div>

        {comentariosAbertos && (
          <section className={styles.comments} aria-label="Comentários">
            <h3 className={styles.commentsTitle}>Comentários</h3>

            {carregandoComentarios && (
              <p className={styles.commentsMessage}>Carregando comentários...</p>
            )}

            {!carregandoComentarios && comentarios.length === 0 && !erroComentario && (
              <p className={styles.commentsMessage}>
                Ainda não há comentários. Seja o primeiro!
              </p>
            )}

            {comentarios.map((comentario) => (
              <article key={comentario.id} className={styles.comment}>
                <div className={styles.commentHeading}>
                  <strong>{comentario.usuario.nome}</strong>
                  <time dateTime={comentario.criadoEm}>
                    {new Date(comentario.criadoEm).toLocaleDateString("pt-BR")}
                  </time>
                </div>

                {comentarioEmEdicao === comentario.id ? (
                  <div className={styles.editComment}>
                    <textarea
                      value={textoEdicao}
                      onChange={(event) => setTextoEdicao(event.target.value)}
                      maxLength={1000}
                      aria-label="Editar comentário"
                    />
                    <div className={styles.commentActions}>
                      <button
                        type="button"
                        disabled={!textoEdicao.trim()}
                        onClick={() => salvarEdicao(comentario.id)}
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setComentarioEmEdicao(null);
                          setTextoEdicao("");
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={styles.commentText}>{comentario.texto}</p>
                )}

                {usuarioId === comentario.usuario.id &&
                  comentarioEmEdicao !== comentario.id && (
                    <div className={styles.commentActions}>
                      <button
                        type="button"
                        aria-label="Editar comentário"
                        onClick={() => {
                          setComentarioEmEdicao(comentario.id);
                          setTextoEdicao(comentario.texto);
                        }}
                      >
                        <Pencil size={15} />
                        Editar
                      </button>
                      <button
                        type="button"
                        aria-label="Excluir comentário"
                        onClick={() => removerComentario(comentario.id)}
                      >
                        <Trash2 size={15} />
                        Excluir
                      </button>
                    </div>
                  )}
              </article>
            ))}

            {usuarioId ? (
              <form className={styles.commentForm} onSubmit={enviarComentario}>
                <textarea
                  value={textoComentario}
                  onChange={(event) => setTextoComentario(event.target.value)}
                  placeholder="Escreva um comentário..."
                  maxLength={1000}
                  required
                  aria-label="Escreva um comentário"
                />
                <div className={styles.commentFormFooter}>
                  <span>{textoComentario.length}/1000</span>
                  <button
                    type="submit"
                    disabled={!textoComentario.trim() || enviandoComentario}
                  >
                    {enviandoComentario ? "Publicando..." : "Comentar"}
                  </button>
                </div>
              </form>
            ) : (
              <p className={styles.commentsMessage}>
                Entre na sua conta para comentar.
              </p>
            )}
          </section>
        )}
        {erroComentario && (
          <p className={styles.commentError} role="alert">
            {erroComentario}
          </p>
        )}
      </div>
    </article>
  );
}
