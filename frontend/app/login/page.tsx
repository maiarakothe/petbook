"use client";

import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [modo, setModo] = useState<"login" | "registro">("login");

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">

      <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl shadow-lg overflow-hidden flex">

        <section className="hidden md:flex md:w-1/2 bg-[var(--secondary)] relative overflow-hidden items-center justify-center p-12">

          <div className="absolute w-64 h-64 rounded-full bg-[var(--primary)] opacity-20 -top-24 -left-24" />
          <div className="absolute w-80 h-80 rounded-full bg-[var(--primary)] opacity-10 -bottom-40 -right-32" />

          <div className="relative z-10 text-center text-white max-w-md">

            <Image
              src="/images/logo-lado.png"
              alt="PetBook"
              width={200}
              height={60}
              className="mb-10 brightness-0 invert"
            />

            <h1 className="text-3xl font-bold mb-4">
              Um lugar para quem ama pets.
            </h1>

            <p className="text-white/75 text-lg leading-relaxed">
              Compartilhe momentos, encontre animais para adoção,
              ajude a localizar pets perdidos e conheça novas histórias.
            </p>

          </div>
        </section>

        <section className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">

          <div className="w-full max-w-md">
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-[var(--secondary)] mt-2">
                {modo === "login"
                  ? "Bem-vindo de volta!"
                  : "Crie sua conta"}
              </h2>
              <p className="text-gray-500 mt-2">
                {modo === "login"
                  ? "Entre para continuar acompanhando seus pets."
                  : "Faça parte da comunidade PetBook."}
              </p>
            </div>


            <form className="space-y-5">
              {modo === "registro" && (
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Nome
                  </label>

                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                />
              </div>

              {modo === "registro" && (
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                  />
                </div>
              )}
              {modo === "login" && (
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    className="text-sm text-[var(--primary)] hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[var(--primary)] text-white font-bold hover:brightness-95 transition shadow-sm"
              >
                {modo === "login" ? "Entrar" : "Criar minha conta"}
              </button>

            </form>


            <div className="flex items-center gap-4 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">
                ou
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>


            <div className="text-center text-sm text-gray-500">

              {modo === "login"
                ? "Ainda não possui uma conta?"
                : "Já possui uma conta?"}

              <button
                type="button"
                onClick={() =>
                  setModo(modo === "login" ? "registro" : "login")
                }
                className="ml-1 font-bold text-[var(--primary)] hover:underline"
              >
                {modo === "login"
                  ? "Criar conta"
                  : "Entrar"}
              </button>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}