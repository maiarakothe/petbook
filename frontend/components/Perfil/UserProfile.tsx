type Usuario = {
    nome: string;
    email: string;
}

type UserProfileProps = {
    usuario: Usuario;
};


export default function UserProfile({ usuario }: UserProfileProps) {
    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">
                    Conta
                </p>

                <h1 className="text-xl font-bold text-[var(--secondary)]">
                    {usuario.nome}
                </h1>

                <p className="text-sm text-gray-500">
                    {usuario.email}
                </p>
            </div>

            <button
                className="px-4 py-2 rounded-xl bg-white border border-black/10
                       text-sm font-semibold
                       hover:border-[var(--primary)]
                       hover:text-[var(--primary)]
                       transition"
            >
                Editar informações
            </button>
        </div>
    );
}
