import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CurtidaService {
  constructor(private prisma: PrismaService) {}

  async curtir(usuarioId: string, publicacaoId: string) {
    return this.prisma.curtida.create({
      data: {
        usuarioId,
        publicacaoId,
      },
    });
  }

  async descurtir(usuarioId: string, publicacaoId: string) {
    return this.prisma.curtida.delete({
      where: {
        usuarioId_publicacaoId: {
          usuarioId,
          publicacaoId,
        },
      },
    });
  }

  async listarCurtidas(publicacaoId: string) {
    return this.prisma.curtida.findMany({
      where: {
        publicacaoId,
      },
      include: {
        usuario: true,
      },
    });
  }
}