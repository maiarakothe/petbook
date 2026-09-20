import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

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
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() dto: CreatePetDto,
    @UploadedFile() foto: Express.Multer.File,
    @Req() request: any,
  ) {
    const usuarioId = request.user.sub;

    return this.petsService.create(
      dto,
      usuarioId,
      foto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request: any) {
    const usuarioId = request.user.sub;

    return this.petsService.findAll(usuarioId);
  }
}
