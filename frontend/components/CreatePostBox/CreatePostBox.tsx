"use client";

import { useEffect, useRef, useState, ChangeEvent, SyntheticEvent } from "react";
import Image from "next/image";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

import styles from "./CreatePostBox.module.css";

import { getPets } from "@/api/pets";
import { createPublicacao } from "@/api/publicacoes";
import { API_URL } from "@/lib/api";
import { useSnackbar } from "@/components/Feedback/SnackbarProvider";

type Pet = {
    id: string;
    nome: string;
    foto: string;
};

type TipoPublicacao = "comum" | "adocao" | "perdidos";

type CreatePostBoxProps = {
    tipoFixo?: Exclude<TipoPublicacao, "comum">;
    onPublicacaoCriada?: () => void | Promise<void>;
};

export default function CreatePostBox({
    tipoFixo,
    onPublicacaoCriada,
}: CreatePostBoxProps) {
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState<TipoPublicacao>(tipoFixo ?? "comum");

    const [pets, setPets] = useState<Pet[]>([]);
    const [petSelecionado, setPetSelecionado] = useState(0);

    const [selectedImage, setSelectedImage] =
        useState<File | null>(null);

    const [selectedImagePreview, setSelectedImagePreview] =
        useState<string | null>(null);

    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const submittingRef = useRef(false);
    const { notify } = useSnackbar();

    useEffect(() => {
        async function carregarPets() {
            try {
                const petsData = await getPets();

                setPets(petsData);
            } catch (error) {
                console.error(
                    "Erro ao carregar pets:",
                    error,
                );
                notify(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar seus pets. Recarregue a página e tente novamente.",
                    "error",
                );
            }
        }

        carregarPets();
    }, [notify]);

    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setSelectedImage(file);

        const imageUrl =
            URL.createObjectURL(file);

        setSelectedImagePreview(imageUrl);
    };

    const handleEmojiClick = (
        emojiData: EmojiClickData,
    ) => {
        setContent(
            (prevContent) =>
                prevContent + emojiData.emoji,
        );

        setShowEmojiPicker(false);
    };

    const removerImagem = () => {
        if (selectedImagePreview) {
            URL.revokeObjectURL(
                selectedImagePreview,
            );
        }

        setSelectedImage(null);
        setSelectedImagePreview(null);
    };

    const handlePostSubmit = async (
        e: SyntheticEvent,
    ) => {
        e.preventDefault();

        if (submittingRef.current) {
            return;
        }

        if (!content.trim() && !selectedImage) {
            return;
        }

        if (!selectedImage) {
            notify("Adicione uma foto para publicar.", "error");
            return;
        }

        if (pets.length === 0) {
            notify("Cadastre um pet antes de criar uma publicação.", "error");
            return;
        }

        const pet = pets[petSelecionado];

        if (!pet) {
            notify("Selecione o pet em nome de quem deseja publicar.", "error");
            return;
        }

        try {
            submittingRef.current = true;
            setLoading(true);

            await createPublicacao({
                legenda: content,
                tipo: postType,
                petId: pet.id,
                foto: selectedImage,
            });

            setContent("");
            removerImagem();
            setShowEmojiPicker(false);
            notify("Publicação criada com sucesso!");
            try {
                await onPublicacaoCriada?.();
            } catch (error) {
                notify(
                    error instanceof Error
                        ? `A publicação foi criada, mas a lista não pôde ser atualizada: ${error.message}`
                        : "A publicação foi criada, mas não foi possível atualizar a lista. Recarregue a página.",
                    "error",
                );
            }
        } catch (error) {
            console.error(
                "Erro ao criar publicação:",
                error,
            );

            if (error instanceof Error) {
                notify(error.message, "error");
            } else {
                notify("Não foi possível criar a publicação. Tente novamente.", "error");
            }
        } finally {
            submittingRef.current = false;
            setLoading(false);
        }
    };

    const fotoPet =
        pets.length > 0
            ? pets[petSelecionado]?.foto
            : null;

    const fotoPetUrl = fotoPet
        ? fotoPet.startsWith("http")
            ? fotoPet
            : `${API_URL}${fotoPet}`
        : null;

    return (
        <div className={styles.card}>
            {tipoFixo ? (
                <div className={styles.fixedType}>
                    {tipoFixo === "adocao" ? "Publicação para adoção" : "Publicação de animal perdido"}
                </div>
            ) : (
            <div className={styles.tabs}>
                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        setPostType("comum")
                    }
                    className={`${styles.tab} ${postType === "comum"
                            ? styles.activeTab
                            : ""
                        }`}
                >
                    Publicação Comum
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        setPostType("adocao")
                    }
                    className={`${styles.tab} ${postType === "adocao"
                            ? styles.activeTab
                            : ""
                        }`}
                >
                    Adoção
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        setPostType("perdidos")
                    }
                    className={`${styles.tab} ${postType === "perdidos"
                            ? styles.activeTab
                            : ""
                        }`}
                >
                    Animal Perdido
                </button>
            </div>
            )}

            <form onSubmit={handlePostSubmit}>
                <div className={styles.formContent}>
                    <div className={styles.avatar}>
                        {fotoPetUrl ? (
                            <Image
                                src={fotoPetUrl}
                                alt={
                                    pets[
                                        petSelecionado
                                    ]?.nome ?? "Pet"
                                }
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)] text-2xl">
                                🐾
                            </div>
                        )}
                    </div>

                    <div
                        className={
                            styles.textareaContainer
                        }
                    >
                        <div className="mb-3">
                            <select
                                value={petSelecionado}
                                onChange={(e) =>
                                    setPetSelecionado(
                                        Number(
                                            e.target.value,
                                        ),
                                    )
                                }
                                disabled={
                                    loading || pets.length === 0
                                }
                                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[var(--secondary)] outline-none transition focus:border-[var(--primary)]"
                            >
                                {pets.length === 0 ? (
                                    <option>
                                        Nenhum pet cadastrado
                                    </option>
                                ) : (
                                    pets.map(
                                        (
                                            pet,
                                            index,
                                        ) => (
                                            <option
                                                key={
                                                    pet.id
                                                }
                                                value={
                                                    index
                                                }
                                            >
                                                Publicar como{" "}
                                                {
                                                    pet.nome
                                                }
                                            </option>
                                        ),
                                    )
                                )}
                            </select>
                        </div>

                        <textarea
                            disabled={loading}
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value,
                                )
                            }
                            placeholder={
                                postType === "adocao"
                                    ? "Conte sobre o pet que procura um lar..."
                                    : postType ===
                                        "perdidos"
                                        ? "Onde e quando o pet foi visto/se perdeu?"
                                        : "No que o seu pet está pensando hoje?"
                            }
                            className={
                                styles.textarea
                            }
                        />

                        {selectedImagePreview && (
                            <div
                                className={
                                    styles.previewContainer
                                }
                            >
                                <Image
                                    src={
                                        selectedImagePreview
                                    }
                                    alt="Preview da imagem"
                                    width={240}
                                    height={180}
                                    className={
                                        styles.previewImage
                                    }
                                    unoptimized
                                />

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={
                                        removerImagem
                                    }
                                    className={
                                        styles.removeImageBtn
                                    }
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showEmojiPicker && (
                    <div
                        className={
                            styles.emojiPickerContainer
                        }
                    >
                        <EmojiPicker
                            onEmojiClick={
                                handleEmojiClick
                            }
                        />
                    </div>
                )}

                <div className={styles.footer}>
                    <div className={styles.actions}>
                        <label
                            className={
                                styles.actionButton
                            }
                        >
                            📷{" "}
                            <span>
                                Adicionar Foto
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                disabled={loading}
                                onChange={
                                    handleImageChange
                                }
                                className="hidden"
                            />
                        </label>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                setShowEmojiPicker(
                                    (prev) => !prev,
                                )
                            }
                            className={
                                styles.actionButton
                            }
                        >
                            😊{" "}
                            <span>
                                Emojis
                            </span>
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            (!content.trim() &&
                                !selectedImage)
                        }
                        className={
                            styles.submitButton
                        }
                    >
                        {loading
                            ? "Publicando..."
                            : "Publicar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
