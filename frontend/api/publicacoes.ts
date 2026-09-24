const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function createPublicacao(
  publicacao: {
    legenda: string;
    tipo: string;
    petId: string;
    foto: File;
  },
) {
  const token =
    localStorage.getItem('petbook_token');

  const formData = new FormData();

  formData.append(
    'legenda',
    publicacao.legenda,
  );

  formData.append(
    'tipo',
    publicacao.tipo,
  );

  formData.append(
    'petId',
    publicacao.petId,
  );

  formData.append(
    'foto',
    publicacao.foto,
  );

  const response = await fetch(
    `${API_URL}/publicacoes`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message ||
            'Erro ao criar publicação.',
    );
  }

  return data;
}

export type Publicacao = {
  id: string;
  foto: string;
  legenda: string;
  tipo: "COMUM" | "PERDIDO" | "ADOCAO";
  pet: {
    id: string;
    nome: string;
    foto: string;
  };
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
};

export async function getPublicacoes(): Promise<Publicacao[]> {
  const response = await fetch(`${API_URL}/publicacoes`);

  if (!response.ok) {
    throw new Error("Erro ao carregar publicações.");
  }

  return response.json();
}