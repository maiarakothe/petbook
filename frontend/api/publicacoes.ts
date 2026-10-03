import { API_URL } from '@/lib/api';

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
  _count: {
    curtidas: number;
    comentarios: number;
  };
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

export async function getPublicacoes(
  tipo?: Publicacao['tipo'],
): Promise<Publicacao[]> {
  const query = tipo ? `?tipo=${tipo}` : '';
  const response = await fetch(`${API_URL}/publicacoes${query}`);

  if (!response.ok) {
    throw new Error("Erro ao carregar publicações.");
  }

  return response.json();
}

export async function getMinhasPublicacoes(): Promise<Publicacao[]> {
  const token = localStorage.getItem('petbook_token');
  const response = await fetch(`${API_URL}/publicacoes/minhas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || 'Erro ao carregar suas publicações.',
    );
  }

  return data;
}

export async function updatePublicacao(
  id: string,
  publicacao: { legenda: string; tipo: string; foto?: File | null },
): Promise<Publicacao> {
  const token = localStorage.getItem('petbook_token');
  const formData = new FormData();
  formData.append('legenda', publicacao.legenda);
  formData.append('tipo', publicacao.tipo);
  if (publicacao.foto) formData.append('foto', publicacao.foto);

  const response = await fetch(`${API_URL}/publicacoes/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro ao atualizar publicação.');
  return data;
}

export async function deletePublicacao(id: string): Promise<void> {
  const token = localStorage.getItem('petbook_token');
  const response = await fetch(`${API_URL}/publicacoes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Erro ao excluir publicação.');
  }
}

  export async function curtirPublicacao(publicacaoId: string) {
  const token = localStorage.getItem("petbook_token");

  const response = await fetch(
    `${API_URL}/publicacoes/${publicacaoId}/curtida`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao curtir publicação.");
  }

  return data;
}

  export async function descurtirPublicacao(publicacaoId: string) {
  const token = localStorage.getItem("petbook_token");

  const response = await fetch(
    `${API_URL}/publicacoes/${publicacaoId}/curtida`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao remover curtida.");
  }

  return data;
}

export type Curtida = {
  usuarioId: string;
};

export async function getCurtidasPublicacao(
  publicacaoId: string,
): Promise<Curtida[]> {
  const response = await fetch(
    `${API_URL}/publicacoes/${publicacaoId}/curtida`,
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar curtidas da publicação.");
  }

  return response.json();
}

export type Comentario = {
  id: string;
  texto: string;
  criadoEm: string;
  atualizadoEm: string;
  usuario: {
    id: string;
    nome: string;
  };
};

async function requestComentarios<T>(
  publicacaoId: string,
  path = "",
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("petbook_token");
  const response = await fetch(
    `${API_URL}/publicacoes/${encodeURIComponent(publicacaoId)}/comentarios${path}`,
    {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
    },
  );

  const responseText = await response.text();
  if (!responseText) {
    if (!response.ok) {
      throw new Error("Não foi possível concluir a operação de comentário.");
    }
    return undefined as T;
  }

  const data = JSON.parse(responseText) as {
    message?: string | string[];
  } & T;
  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Não foi possível concluir a operação de comentário.",
    );
  }

  return data;
}

export function getComentarios(
  publicacaoId: string,
): Promise<Comentario[]> {
  return requestComentarios<Comentario[]>(publicacaoId);
}

export function criarComentario(
  publicacaoId: string,
  texto: string,
): Promise<Comentario> {
  return requestComentarios<Comentario>(publicacaoId, "", {
    method: "POST",
    body: JSON.stringify({ texto }),
  });
}

export function atualizarComentario(
  publicacaoId: string,
  comentarioId: string,
  texto: string,
): Promise<Comentario> {
  return requestComentarios<Comentario>(
    publicacaoId,
    `/${encodeURIComponent(comentarioId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ texto }),
    },
  );
}

export function excluirComentario(
  publicacaoId: string,
  comentarioId: string,
): Promise<void> {
  return requestComentarios<void>(
    publicacaoId,
    `/${encodeURIComponent(comentarioId)}`,
    { method: "DELETE" },
  );
}
