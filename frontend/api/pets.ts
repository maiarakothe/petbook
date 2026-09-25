import { API_URL } from '@/lib/api';

export async function createPet(pet: {
  nome: string;
  raca: string;
  tipo: string;
  idade: string;
  localizacao: string;
  foto: File | null;
}) {
  const token = localStorage.getItem('petbook_token');

  const formData = new FormData();

  formData.append('nome', pet.nome);
  formData.append('raca', pet.raca);
  formData.append('tipoAnimal', pet.tipo);
  formData.append('idade', pet.idade);
  formData.append('localizacao', pet.localizacao);

  if (pet.foto) {
    formData.append('foto', pet.foto);
  }

  const response = await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || 'Erro ao cadastrar pet.',
    );
  }

  return data;
}

export async function getPets() {
  const token = localStorage.getItem("petbook_token");

  const response = await fetch(`${API_URL}/pets`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Erro ao buscar pets.",
    );
  }

  return data;
}
