import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePetDto>,
    @UploadedFile() foto: Express.Multer.File | undefined,
    @Req() request: any,
  ) {
    return this.petsService.update(id, request.user.sub, dto, foto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() request: any) {
    return this.petsService.remove(id, request.user.sub);
  }
}
