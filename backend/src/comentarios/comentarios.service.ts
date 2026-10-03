import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const comentarioSelect = {
  id: true,
  texto: true,
  criadoEm: true,
  atualizadoEm: true,
  usuario: {
    select: {
      id: true,
      nome: true,
    },
  },
} as const;

@Injectable()
export class ComentariosService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(publicacaoId: string) {
    await this.verificarPublicacao(publicacaoId);

    return this.prisma.comentario.findMany({
      where: { publicacaoId },
      select: comentarioSelect,
      orderBy: { criadoEm: 'asc' },
    });
  }

  async criar(publicacaoId: string, usuarioId: string, texto: string) {
    const textoValidado = this.validarTexto(texto);
    await this.verificarPublicacao(publicacaoId);

    return this.prisma.comentario.create({
      data: { texto: textoValidado, publicacaoId, usuarioId },
      select: comentarioSelect,
    });
  }

  async atualizar(
    publicacaoId: string,
    comentarioId: string,
    usuarioId: string,
    texto: string,
  ) {
    const textoValidado = this.validarTexto(texto);
    const comentario = await this.prisma.comentario.findFirst({
      where: { id: comentarioId, publicacaoId, usuarioId },
      select: { id: true },
    });

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    return this.prisma.comentario.update({
      where: { id: comentarioId },
      data: { texto: textoValidado },
      select: comentarioSelect,
    });
  }

  async remover(
    publicacaoId: string,
    comentarioId: string,
    usuarioId: string,
  ) {
    const comentario = await this.prisma.comentario.findFirst({
      where: { id: comentarioId, publicacaoId, usuarioId },
      select: { id: true },
    });

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    await this.prisma.comentario.delete({ where: { id: comentarioId } });
  }

  private async verificarPublicacao(publicacaoId: string) {
    const publicacao = await this.prisma.publicacao.findUnique({
      where: { id: publicacaoId },
      select: { id: true },
    });

    if (!publicacao) {
      throw new NotFoundException('Publicação não encontrada.');
    }
  }

  private validarTexto(texto: string) {
    if (typeof texto !== 'string' || !texto.trim()) {
      throw new BadRequestException('O comentário não pode ficar vazio.');
    }

    const textoValidado = texto.trim();
    if (textoValidado.length > 1000) {
      throw new BadRequestException(
        'O comentário deve ter no máximo 1000 caracteres.',
      );
    }

    return textoValidado;
  }
}
