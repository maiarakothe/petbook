"use client";

import { useState, ChangeEvent, SyntheticEvent } from "react";
import Image from "next/image";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import styles from "./CreatePostBox.module.css";

export default function CreatePostBox() {
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState("comum");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setContent((prevContent) => prevContent + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const handlePostSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (!content.trim() && !selectedImage) return;

        console.log("Enviando post:", { content, postType, selectedImage });

        setContent("");
        setSelectedImage(null);
        setShowEmojiPicker(false);
    };

    return (
        <div className={styles.card}>

            <div className={styles.tabs}>
                <button
                    type="button"
                    onClick={() => setPostType("comum")}
                    className={`${styles.tab} ${postType === "comum" ? styles.activeTab : ""}`}
                >
                    Publicação Comum
                </button>
                <button
                    type="button"
                    onClick={() => setPostType("adocao")}
                    className={`${styles.tab} ${postType === "adocao" ? styles.activeTab : ""}`}
                >
                    Adoção
                </button>
                <button
                    type="button"
                    onClick={() => setPostType("perdidos")}
                    className={`${styles.tab} ${postType === "perdidos" ? styles.activeTab : ""}`}
                >
                    Animal Perdido
                </button>
            </div>

            <form onSubmit={handlePostSubmit}>
                <div className={styles.formContent}>
                    <div className={styles.avatar}>
                        🐶
                    </div>

                    <div className={styles.textareaContainer}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={
                                postType === "adocao"
                                    ? "Conte sobre o pet que procura um lar..."
                                    : postType === "perdidos"
                                        ? "Onde e quando o pet foi visto/se perdeu?"
                                        : "No que o seu pet está pensando hoje?"
                            }
                            className={styles.textarea}
                        />

                        {selectedImage && (
                            <div className={styles.previewContainer}>
                                <Image
                                    src={selectedImage}
                                    alt="Preview da imagem"
                                    width={240}
                                    height={180}
                                    className={styles.previewImage}
                                />
                                <button
                                    type="button"
                                    onClick={() => setSelectedImage(null)}
                                    className={styles.removeImageBtn}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showEmojiPicker && (
                    <div className={styles.emojiPickerContainer}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}

                <div className={styles.footer}>
                    <div className={styles.actions}>
                        <label className={styles.actionButton}>
                            📷 <span>Adicionar Foto</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker((prev) => !prev)}
                            className={styles.actionButton}
                        >
                            😊 <span>Emojis</span>
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!content.trim() && !selectedImage}
                        className={styles.submitButton}
                    >
                        Publicar
                    </button>
                </div>
            </form>
        </div>
    );
}