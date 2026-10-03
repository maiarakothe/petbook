import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { PublicacoesModule } from './publicacao/publicacoes.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CurtidaModule } from './curtidas/curtidasModule';
import { ComentariosModule } from './comentarios/comentarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    AuthModule,
    PetsModule,
    PublicacoesModule,
    CloudinaryModule,
    CurtidaModule,
    ComentariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
