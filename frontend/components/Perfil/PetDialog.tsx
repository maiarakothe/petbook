"use client";

import { useState } from "react";
import Image from "next/image";

interface PetDialogProps {
    aberto: boolean;
    onClose: () => void;
    onCadastrar: (pet: {
        nome: string;
        raca: string;
        tipo: string;
        idade: string;
        localizacao: string;
        foto: File | null;
    }) => void;
}

export default function PetDialog({
    aberto,
    onClose,
    onCadastrar,
}: PetDialogProps) {
    const [nome, setNome] = useState("");
    const [raca, setRaca] = useState("");
    const [tipo, setTipo] = useState("");
    const [idade, setIdade] = useState("");
    const [localizacao, setLocalizacao] = useState("");
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState("");

    if (!aberto) {
        return null;
    }

    function selecionarFoto(event: React.ChangeEvent<HTMLInputElement>) {
        const arquivo = event.target.files?.[0] ?? null;

        if (!arquivo) {
            return;
        }

        setFoto(arquivo);
        setFotoPreview(URL.createObjectURL(arquivo));
    }

    function cadastrar() {
        if (!nome || !tipo) {
            return;
        }

        onCadastrar({
            nome,
            raca,
            tipo,
            idade,
            localizacao,
            foto,
        });

        setNome("");
        setRaca("");
        setTipo("");
        setIdade("");
        setLocalizacao("");
        setFoto(null);
        setFotoPreview("");

        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--secondary)]">
                            Cadastrar pet
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Crie o perfil do seu animalzinho.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-gray-400 transition hover:text-[var(--primary)]"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-6 flex flex-col items-center">
                    <label
                        htmlFor="foto-pet"
                        className="flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[var(--primary)]/40 bg-[var(--primary)]/5 transition hover:bg-[var(--primary)]/10"
                    >
                        {fotoPreview ? (
                            <Image
                                src={fotoPreview}
                                alt="Prévia da foto do pet"
                                width={112}
                                height={112}
                                unoptimized
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl">🐾</span>
                        )}
                    </label>

                    <input
                        id="foto-pet"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={selecionarFoto}
                    />

                    <label
                        htmlFor="foto-pet"
                        className="mt-2 cursor-pointer text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                        {foto ? "Alterar foto" : "Adicionar foto"}
                    </label>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-semibold">
                            Nome *
                        </label>

                        <input
                            type="text"
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                            placeholder="Ex: Mel"
                            className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold">
                            Tipo de animal *
                        </label>

                        <select
                            value={tipo}
                            onChange={(event) => setTipo(event.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                        >
                            <option value="">Selecione</option>
                            <option value="Cachorro">Cachorro</option>
                            <option value="Gato">Gato</option>
                            <option value="Coelho">Coelho</option>
                            <option value="Ave">Ave</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold">
                            Raça
                        </label>

                        <input
                            type="text"
                            value={raca}
                            onChange={(event) => setRaca(event.target.value)}
                            placeholder="Ex: Golden Retriever"
                            className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-semibold">
                                Idade
                            </label>

                            <input
                                type="text"
                                value={idade}
                                onChange={(event) => setIdade(event.target.value)}
                                placeholder="Ex: 3 anos"
                                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold">
                                Localização
                            </label>

                            <input
                                type="text"
                                value={localizacao}
                                onChange={(event) => setLocalizacao(event.target.value)}
                                placeholder="Ex: Itapiranga - SC"
                                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-7 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-100"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={cadastrar}
                        className="rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
                    >
                        Cadastrar pet
                    </button>
                </div>
            </div>
        </div>
    );
}