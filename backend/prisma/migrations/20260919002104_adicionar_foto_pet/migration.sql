/*
  Warnings:

  - Added the required column `foto` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foto` to the `publicacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petId` to the `publicacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `publicacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `publicacoes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoPublicacao" AS ENUM ('COMUM', 'PERDIDO', 'ADOCAO');

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "foto" TEXT NOT NULL,
ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "publicacoes" ADD COLUMN     "foto" TEXT NOT NULL,
ADD COLUMN     "petId" TEXT NOT NULL,
ADD COLUMN     "tipo" "TipoPublicacao" NOT NULL,
ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicacoes" ADD CONSTRAINT "publicacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicacoes" ADD CONSTRAINT "publicacoes_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
