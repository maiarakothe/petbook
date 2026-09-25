import { Injectable } from '@nestjs/common';
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

    async findAll() {
        return this.prisma.publicacao.findMany({
            include: {
                pet: true,
                usuario: true,
            },
            orderBy: {
                id: 'desc',
            },
        });
    }
}