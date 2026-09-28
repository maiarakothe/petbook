import {Body, Get, Param, Delete, Controller, Post} from '@nestjs/common';
import { CurtidaService } from './curtidas.service';

@Controller('publicacoes')
export class CurtidaController {
  constructor(private readonly curtidaService: CurtidaService) {}

  @Post(':publicacaoId/curtida')
  curtir(
    @Param('publicacaoId') publicacaoId: string,
    @Body('usuarioId') usuarioId: string,
  ) {
    return this.curtidaService.curtir(usuarioId, publicacaoId);
  }

  @Delete(':publicacaoId/curtida')
  descurtir(
    @Param('publicacaoId') publicacaoId: string,
    @Body('usuarioId') usuarioId: string,
  ) {
    return this.curtidaService.descurtir(usuarioId, publicacaoId);
  }

  @Get(':publicacaoId/curtida')
  listar(@Param('publicacaoId') publicacaoId: string) {
    return this.curtidaService.listarCurtidas(publicacaoId);
  }
}