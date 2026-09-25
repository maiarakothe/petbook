import { Injectable } from '@nestjs/common';
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
}
