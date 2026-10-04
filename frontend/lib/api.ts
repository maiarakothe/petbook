export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

export async function readApiResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const responseText = await response.text();
  let data: { message?: unknown; error?: unknown; detail?: unknown } | undefined;

  if (responseText) {
    try {
      data = JSON.parse(responseText) as typeof data;
    } catch {
      if (!response.ok) {
        throw new Error(`${fallbackMessage} (HTTP ${response.status}).`);
      }
      throw new Error("O servidor retornou uma resposta inválida. Tente novamente.");
    }
  }

  if (!response.ok) {
    const serverMessage = data?.message ?? data?.detail ?? data?.error;
    const messages = Array.isArray(serverMessage)
      ? serverMessage.filter((item): item is string => typeof item === "string").join("; ")
      : typeof serverMessage === "string" && serverMessage.trim()
        ? serverMessage
        : "";
    const message = messages || `${fallbackMessage} (HTTP ${response.status}).`;

    throw new Error(message);
  }

  return data as T;
}

export async function fetchApi(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
    }
    throw error;
  }
}

export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetchApi(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  return readApiResponse<T>(response, `Não foi possível concluir a requisição para ${endpoint}.`);
}