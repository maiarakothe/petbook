import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreatePetDto,
    @Req() request: any,
  ) {
    const usuarioId = request.user.sub;

    return this.petsService.create(
      dto,
      usuarioId,
    );
  }
}