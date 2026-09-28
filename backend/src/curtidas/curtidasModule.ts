import { Module } from "@nestjs/common";
import { CurtidaController } from "./curtidas.controller";
import { CurtidaService } from "./curtidas.service";

@Module({
  controllers: [CurtidaController],
  providers: [CurtidaService],
  exports: [CurtidaService],
})
export class CurtidaModule {}