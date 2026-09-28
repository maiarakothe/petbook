import {
    Body,
    Param,
    Controller,
    Post,
    Get,
    Delete,
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
import { CurtidaService } from '../curtidas/curtidas.service';

@Controller('publicacoes')
export class PublicacoesController {
    constructor(
        private readonly publicacoesService: PublicacoesService,
        private readonly curtidaService: CurtidaService,
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
    
    @Post(':publicacaoId/curtida')
  @UseGuards(JwtAuthGuard)
  curtir(
    @Param('publicacaoId') publicacaoId: string,
    @Req() request: any,
  ) {
    return this.curtidaService.curtir(
      request.user.sub,
      publicacaoId,
    );
  }

  @Delete(':publicacaoId/curtida')
  @UseGuards(JwtAuthGuard)
  descurtir(
    @Param('publicacaoId') publicacaoId: string,
    @Req() request: any,
  ) {
    return this.curtidaService.descurtir(
      request.user.sub,
      publicacaoId,
    );
  }

  @Get(':publicacaoId/curtida')
  listar(@Param('publicacaoId') publicacaoId: string) {
    return this.curtidaService.listarCurtidas(publicacaoId);
  }
}
