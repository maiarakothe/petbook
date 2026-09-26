"use client";

import { useState } from "react";
import type { Usuario } from "@/api/auth";

type UserDialogProps = {
    aberto: boolean;
    usuario: Usuario;
    onClose: () => void;
    onSalvar: (dados: Pick<Usuario, "nome" | "email">) => Promise<void>;
};

export default function UserDialog({
    aberto,
    usuario,
    onClose,
    onSalvar,
}: UserDialogProps) {
    const [nome, setNome] = useState(usuario.nome);
    const [email, setEmail] = useState(usuario.email);
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    if (!aberto) {
        return null;
    }

    async function salvar() {
        setSalvando(true);
        setErro("");

        try {
            await onSalvar({ nome, email });
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao atualizar conta.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="editar-conta-titulo"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 id="editar-conta-titulo" className="text-xl font-bold text-[var(--secondary)]">
                        Editar informações
                    </h2>
                    <button type="button" onClick={onClose} aria-label="Fechar" className="text-2xl text-gray-400">
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-semibold">
                        Nome
                        <input
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                            required
                            className="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-[var(--primary)]"
                        />
                    </label>
                    <label className="block text-sm font-semibold">
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 font-normal outline-none focus:border-[var(--primary)]"
                        />
                    </label>
                </div>

                {erro && <p role="alert" className="mt-3 text-sm text-red-600">{erro}</p>}

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={salvar}
                        disabled={salvando || !nome.trim() || !email.trim()}
                        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {salvando ? "Salvando..." : "Salvar alterações"}
                    </button>
                </div>
            </section>
        </div>
    );
}