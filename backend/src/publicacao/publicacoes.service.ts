import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto';

import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

@Injectable()
export class PublicacoesService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(
        dto: CreatePublicacaoDto,
        usuarioId: string,
        foto: Express.Multer.File,
    ) {
        const uploadsPath = join(
            process.cwd(),
            'uploads',
        );

        await mkdir(uploadsPath, {
            recursive: true,
        });

        const nomeArquivo =
            `${Date.now()}-${foto.originalname}`;

        const caminhoArquivo = join(
            uploadsPath,
            nomeArquivo,
        );

        await writeFile(
            caminhoArquivo,
            foto.buffer,
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
                    foto: `/uploads/${nomeArquivo}`,
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