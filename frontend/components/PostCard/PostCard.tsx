"use client";

import styles from "./PostCard.module.css";

import Image from "next/image";

import { MessageCircle, Heart, Pencil, Trash2 } from "lucide-react";

import { useEffect, useRef, useState } from "react";

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
import { useSnackbar } from "@/components/Feedback/SnackbarProvider";

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
  const [comentarioEmAcao, setComentarioEmAcao] = useState<string | null>(null);
  const operationRef = useRef({ like: false, comment: false, commentAction: false });
  const { notify } = useSnackbar();

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
        notify(error instanceof Error ? error.message : "Não foi possível carregar o estado da curtida.", "error");
      } finally {
        if (ativo) setCarregandoCurtida(false);
      }
    }

    carregarCurtida();

    return () => {
      ativo = false;
    };
  }, [id, notify]);

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
    if (operationRef.current.commentAction || carregandoComentarios) return;
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
      const message = error instanceof Error
        ? error.message
        : "Não foi possível carregar os comentários. Tente novamente.";
      setErroComentario(message);
      notify(message, "error");
    } finally {
      setCarregandoComentarios(false);
    }
  }

  async function alterarCurtida() {
    if (carregandoCurtida || operationRef.current.like) return;

    operationRef.current.like = true;
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
      notify(error instanceof Error ? error.message : "Não foi possível atualizar a curtida. Tente novamente.", "error");
    } finally {
      operationRef.current.like = false;
      setAlterandoCurtida(false);
    }
  }

  async function enviarComentario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!textoComentario.trim() || operationRef.current.comment) return;

    operationRef.current.comment = true;
    try {
      setEnviandoComentario(true);
      setErroComentario("");
      const comentario = await criarComentario(id, textoComentario);
      setComentarios((atuais) => [...atuais, comentario]);
      setTotalComentarios((total) => total + 1);
      setTextoComentario("");
      notify("Comentário publicado.");
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Não foi possível publicar o comentário. Tente novamente.";
      setErroComentario(message);
      notify(message, "error");
    } finally {
      operationRef.current.comment = false;
      setEnviandoComentario(false);
    }
  }

  async function salvarEdicao(comentarioId: string) {
    if (!textoEdicao.trim() || operationRef.current.commentAction) return;

    operationRef.current.commentAction = true;
    setComentarioEmAcao(comentarioId);
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
      const message = error instanceof Error
        ? error.message
        : "Não foi possível editar o comentário. Tente novamente.";
      setErroComentario(message);
      notify(message, "error");
    } finally {
      operationRef.current.commentAction = false;
      setComentarioEmAcao(null);
    }
  }

  async function removerComentario(comentarioId: string) {
    if (!window.confirm("Deseja excluir este comentário?")) return;
    if (operationRef.current.commentAction) return;

    operationRef.current.commentAction = true;
    setComentarioEmAcao(comentarioId);
    try {
      setErroComentario("");
      await excluirComentario(id, comentarioId);
      setComentarios((atuais) =>
        atuais.filter((comentario) => comentario.id !== comentarioId),
      );
      setTotalComentarios((total) => Math.max(0, total - 1));
      notify("Comentário excluído.");
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Não foi possível excluir o comentário. Tente novamente.";
      setErroComentario(message);
      notify(message, "error");
    } finally {
      operationRef.current.commentAction = false;
      setComentarioEmAcao(null);
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
            disabled={carregandoComentarios}
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
                        disabled={!textoEdicao.trim() || comentarioEmAcao === comentario.id}
                        onClick={() => salvarEdicao(comentario.id)}
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        disabled={comentarioEmAcao === comentario.id}
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
                        disabled={comentarioEmAcao === comentario.id}
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
