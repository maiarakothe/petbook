import { API_URL, fetchApi, readApiResponse } from '@/lib/api';

export type Pet = {
  id: string;
  nome: string;
  foto: string;
  raca: string;
  tipo_animal: string;
  idade: string;
  localizacao: string;
};

type PetInput = {
  nome: string;
  raca: string;
  tipo: string;
  idade: string;
  localizacao: string;
  foto: File | null;
};

export async function createPet(pet: PetInput): Promise<Pet> {
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

  const response = await fetchApi(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return readApiResponse<Pet>(response, 'Não foi possível cadastrar o pet.');
}

export async function updatePet(id: string, pet: PetInput): Promise<Pet> {
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

  const response = await fetchApi(`${API_URL}/pets/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return readApiResponse<Pet>(response, 'Não foi possível atualizar o pet.');
}

export async function getPets(): Promise<Pet[]> {
  const token = localStorage.getItem("petbook_token");

  const response = await fetchApi(`${API_URL}/pets`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readApiResponse<Pet[]>(response, 'Não foi possível carregar os pets.');
}

export async function deletePet(id: string): Promise<void> {
  const token = localStorage.getItem('petbook_token');
  const response = await fetchApi(`${API_URL}/pets/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    await readApiResponse(response, 'Não foi possível excluir o pet.');
  }
}
