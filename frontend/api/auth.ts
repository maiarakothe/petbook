const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Ocorreu um erro.",
    );
  }

  return data;
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