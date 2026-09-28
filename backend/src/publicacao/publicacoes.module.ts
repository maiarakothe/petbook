import { Module } from '@nestjs/common';

import { PublicacoesController } from './publicacoes.controller';
import { PublicacoesService } from './publicacoes.service';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CurtidaModule } from '../curtidas/curtidasModule';

@Module({
    imports: [AuthModule, CloudinaryModule, CurtidaModule],
    controllers: [PublicacoesController],
    providers: [PublicacoesService],
})
export class PublicacoesModule { }