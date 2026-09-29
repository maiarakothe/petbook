import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PublicacoesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async create(
        dto: CreatePublicacaoDto,
        usuarioId: string,
        foto: Express.Multer.File,
    ) {
        const fotoUrl = await this.cloudinaryService.uploadImage(
            foto,
            'petbook/publicacoes',
        );

        let tipo: 'COMUM' | 'PERDIDO' | 'ADOCAO';

        if (dto.tipo === 'adocao') {
            tipo = 'ADOCAO';
        } else if (dto.tipo === 'perdidos') {
            tipo = 'PERDIDO';
        } else {
            tipo = 'COMUM';
        }

        const publicacao =
            await this.prisma.publicacao.create({
                data: {
                    foto: fotoUrl,
                    legenda: dto.legenda,
                    tipo,

                    usuario: {
                        connect: {
                            id: usuarioId,
                        },
                    },

                    pet: {
                        connect: {
                            id: dto.petId,
                        },
                    },
                },
            });

        return publicacao;
    }

    async findAll(tipo?: string) {
        return this.prisma.publicacao.findMany({
            where: tipo
                ? {
                    tipo: tipo as 'COMUM' | 'PERDIDO' | 'ADOCAO',
                }
                : undefined,
            include: {
                pet: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },


                _count: {
                    select: {
                        curtidas: true,
                    },
                },
            },
            orderBy: {
                id: 'desc',
            },
        });
    }

    async update(
        id: string,
        usuarioId: string,
        dto: Partial<CreatePublicacaoDto>,
        foto?: Express.Multer.File,
    ) {
        const publicacao = await this.prisma.publicacao.findFirst({
            where: { id, usuarioId },
        });

        if (!publicacao) {
            throw new NotFoundException('Publicação não encontrada.');
        }

        const fotoUrl = foto
            ? await this.cloudinaryService.uploadImage(foto, 'petbook/publicacoes')
            : undefined;

        const tipo = dto.tipo
            ? dto.tipo === 'adocao'
                ? 'ADOCAO'
                : dto.tipo === 'perdidos'
                    ? 'PERDIDO'
                    : 'COMUM'
            : undefined;

        return this.prisma.publicacao.update({
            where: { id },
            data: {
                ...(dto.legenda !== undefined && { legenda: dto.legenda }),
                ...(tipo !== undefined && { tipo }),
                ...(fotoUrl !== undefined && { foto: fotoUrl }),
            },
        });
    }

    async remove(id: string, usuarioId: string) {
        const publicacao = await this.prisma.publicacao.findFirst({
            where: { id, usuarioId },
        });

        if (!publicacao) {
            throw new NotFoundException('Publicação não encontrada.');
        }

        await this.prisma.$transaction([
            this.prisma.curtida.deleteMany({ where: { publicacaoId: id } }),
            this.prisma.publicacao.delete({ where: { id } }),
        ]);
    }
    async findByUsuario(usuarioId: string) {
        return this.prisma.publicacao.findMany({
            where: { usuarioId },
            include: {
                pet: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        curtidas: true,
                    },
                },
            },
            orderBy: {
                id: 'desc',
            },
        });
    }
}
