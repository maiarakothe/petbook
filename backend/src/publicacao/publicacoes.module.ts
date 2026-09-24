import { Module } from '@nestjs/common';

import { PublicacoesController } from './publicacoes.controller';
import { PublicacoesService } from './publicacoes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [PublicacoesController],
    providers: [PublicacoesService],
})
export class PublicacoesModule { }