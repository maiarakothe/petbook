const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadImage(file: File) {
  const token = localStorage.getItem("petbook_token");

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Erro ao enviar imagem.",
    );
  }

  return data.url;
}
