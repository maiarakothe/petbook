"use client";

import { useEffect, useState, ChangeEvent, SyntheticEvent } from "react";
import Image from "next/image";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

import styles from "./CreatePostBox.module.css";

import { getPets } from "@/api/pets";
import { createPublicacao } from "@/api/publicacoes";
import { API_URL } from "@/lib/api";

type Pet = {
    id: string;
    nome: string;
    foto: string;
};

export default function CreatePostBox() {
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState("comum");

    const [pets, setPets] = useState<Pet[]>([]);
    const [petSelecionado, setPetSelecionado] = useState(0);

    const [selectedImage, setSelectedImage] =
        useState<File | null>(null);

    const [selectedImagePreview, setSelectedImagePreview] =
        useState<string | null>(null);

    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);

    const [loading, setLoading] = useState(false);

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
            }
        }

        carregarPets();
    }, []);

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

        if (loading) {
            return;
        }

        if (!content.trim() && !selectedImage) {
            return;
        }

        if (!selectedImage) {
            alert("Adicione uma foto para publicar.");
            return;
        }

        if (pets.length === 0) {
            alert(
                "Você precisa ter um pet cadastrado para publicar.",
            );
            return;
        }

        const pet = pets[petSelecionado];

        if (!pet) {
            alert("Selecione um pet.");
            return;
        }

        try {
            setLoading(true);

            await createPublicacao({
                legenda: content,
                tipo: postType,
                petId: pet.id,
                foto: selectedImage,
            });

            alert(
                "Publicação criada com sucesso!",
            );

            setContent("");
            removerImagem();
            setShowEmojiPicker(false);
        } catch (error) {
            console.error(
                "Erro ao criar publicação:",
                error,
            );

            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert(
                    "Erro ao criar publicação.",
                );
            }
        } finally {
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
            <div className={styles.tabs}>
                <button
                    type="button"
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
                                    pets.length === 0
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
                                onChange={
                                    handleImageChange
                                }
                                className="hidden"
                            />
                        </label>

                        <button
                            type="button"
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