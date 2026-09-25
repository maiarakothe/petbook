import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(
    dto: CreatePetDto,
    usuarioId: string,
    foto: Express.Multer.File,
  ) {
    const uploadsPath = join(process.cwd(), 'uploads');

    await mkdir(uploadsPath, { recursive: true });

    const nomeArquivo = `${Date.now()}-${foto.originalname}`;

    const caminhoArquivo = join(
      uploadsPath,
      nomeArquivo,
    );

    await writeFile(
      caminhoArquivo,
      foto.buffer,
    );

    const fotoUrl = `/uploads/${nomeArquivo}`;

    const pet = await this.prisma.pet.create({
      data: {
        nome: dto.nome,
        foto: fotoUrl,
        raca: dto.raca,
        tipo_animal: dto.tipoAnimal,
        idade: dto.idade,
        localizacao: dto.localizacao,

        usuario: {
          connect: {
            id: usuarioId,
          },
        },
      },
    });

    return pet;
  }

  async findAll(usuarioId: string) {
    return this.prisma.pet.findMany({
      where: {
        usuarioId,
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }
}
