import {
    Body,
    Controller,
    Post,
    Get,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import {
    FileInterceptor,
} from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

import { PublicacoesService } from './publicacoes.service';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('publicacoes')
export class PublicacoesController {
    constructor(
        private readonly publicacoesService: PublicacoesService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('foto', {
            storage: memoryStorage(),
        }),
    )
    create(
        @Body() dto: CreatePublicacaoDto,
        @UploadedFile() foto: Express.Multer.File,
        @Req() request: any,
    ) {
        const usuarioId = request.user.sub;

        return this.publicacoesService.create(
            dto,
            usuarioId,
            foto,
        );
    }

    @Get('minhas')
    @UseGuards(JwtAuthGuard)
    findMine(@Req() request: any) {
        return this.publicacoesService.findByUsuario(
            request.user.sub,
        );
    }

    @Get()
    findAll(@Query('tipo') tipo?: string) {
        return this.publicacoesService.findAll(tipo);
    }
}
