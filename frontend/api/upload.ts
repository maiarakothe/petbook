import { API_URL, fetchApi, readApiResponse } from "@/lib/api";

export async function uploadImage(file: File) {
  const token = localStorage.getItem("petbook_token");

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetchApi(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await readApiResponse<{ url: string }>(response, "Não foi possível enviar a imagem.");
  return data.url;
}
