import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create(
    dto: CreatePetDto,
    usuarioId: string,
    foto: Express.Multer.File,
  ) {
    const fotoUrl = await this.cloudinaryService.uploadImage(foto, 'petbook/pets');

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

  async update(
    id: string,
    usuarioId: string,
    dto: Partial<CreatePetDto>,
    foto?: Express.Multer.File,
  ) {
    const pet = await this.prisma.pet.findFirst({
      where: { id, usuarioId },
    });

    if (!pet) {
      throw new NotFoundException('Pet não encontrado.');
    }

    const fotoUrl = foto
      ? await this.cloudinaryService.uploadImage(foto, 'petbook/pets')
      : undefined;

    return this.prisma.pet.update({
      where: { id },
      data: {
        ...(dto.nome !== undefined && { nome: dto.nome }),
        ...(dto.raca !== undefined && { raca: dto.raca }),
        ...(dto.tipoAnimal !== undefined && { tipo_animal: dto.tipoAnimal }),
        ...(dto.idade !== undefined && { idade: dto.idade }),
        ...(dto.localizacao !== undefined && { localizacao: dto.localizacao }),
        ...(fotoUrl !== undefined && { foto: fotoUrl }),
      },
    });
  }
}
