import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ComentarioDto } from './dto/comentario.dto';
import { ComentariosService } from './comentarios.service';

@Controller('publicacoes/:publicacaoId/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Get()
  listar(@Param('publicacaoId') publicacaoId: string) {
    return this.comentariosService.listar(publicacaoId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  criar(
    @Param('publicacaoId') publicacaoId: string,
    @Body() dto: ComentarioDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.comentariosService.criar(
      publicacaoId,
      request.user.sub,
      dto.texto,
    );
  }

  @Patch(':comentarioId')
  @UseGuards(JwtAuthGuard)
  atualizar(
    @Param('publicacaoId') publicacaoId: string,
    @Param('comentarioId') comentarioId: string,
    @Body() dto: ComentarioDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.comentariosService.atualizar(
      publicacaoId,
      comentarioId,
      request.user.sub,
      dto.texto,
    );
  }

  @Delete(':comentarioId')
  @UseGuards(JwtAuthGuard)
  remover(
    @Param('publicacaoId') publicacaoId: string,
    @Param('comentarioId') comentarioId: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.comentariosService.remover(
      publicacaoId,
      comentarioId,
      request.user.sub,
    );
  }
}
