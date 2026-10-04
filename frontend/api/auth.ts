import { API_URL, fetchApi, readApiResponse } from '@/lib/api';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: Usuario;
}

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetchApi(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  return readApiResponse<T>(response, "Não foi possível concluir a operação da conta.");
}

export async function register(
  nome: string,
  email: string,
  senha: string,
) {
  return request<Usuario>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      nome,
      email,
      senha,
    }),
  });
}

export async function login(
  email: string,
  senha: string,
) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      senha,
    }),
  });
}

export async function updateProfile(
  usuario: Pick<Usuario, "nome" | "email">,
) {
  const token = localStorage.getItem("petbook_token");

  return request<Usuario>("/auth/perfil", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(usuario),
  });
}