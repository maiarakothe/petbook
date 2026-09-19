import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(
    dto: CreatePetDto,
    usuarioId: string,
  ) {
    const pet = await this.prisma.pet.create({
      data: {
        nome: dto.nome,
        foto: dto.foto,
        raca: dto.raca,
        tipo_animal: dto.tipoAnimal,
        idade: dto.idade,
        localizacao: dto.localizacao,
        usuarioId,
      },
    });

    return pet;
  }
}