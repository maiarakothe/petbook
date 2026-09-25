import { Module } from '@nestjs/common';

import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [
    PetsController,
  ],
  providers: [
    PetsService,
  ],
})
export class PetsModule { }
