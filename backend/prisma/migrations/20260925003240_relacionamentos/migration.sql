/*
  Warnings:

  - The primary key for the `pets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `pets` table. All the data in the column will be lost.
  - The primary key for the `publicacoes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `publicacoes` table. All the data in the column will be lost.
  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `usuarios` table. All the data in the column will be lost.
  - The required column `idPet` was added to the `pets` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `idUsuario` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idPet` to the `publicacoes` table without a default value. This is not possible if the table is not empty.
  - The required column `idPubli` was added to the `publicacoes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `idUsuario` was added to the `usuarios` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "pets" DROP CONSTRAINT "pets_pkey",
DROP COLUMN "id",
ADD COLUMN     "idPet" TEXT NOT NULL,
ADD COLUMN     "idUsuario" TEXT NOT NULL,
ADD CONSTRAINT "pets_pkey" PRIMARY KEY ("idPet");

-- AlterTable
ALTER TABLE "publicacoes" DROP CONSTRAINT "publicacoes_pkey",
DROP COLUMN "id",
ADD COLUMN     "idPet" TEXT NOT NULL,
ADD COLUMN     "idPubli" TEXT NOT NULL,
ADD CONSTRAINT "publicacoes_pkey" PRIMARY KEY ("idPubli");

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
DROP COLUMN "id",
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idUsuario" TEXT NOT NULL,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idUsuario");

-- CreateTable
CREATE TABLE "Comentario" (
    "idComen" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "idPubli" TEXT NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("idComen")
);

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicacoes" ADD CONSTRAINT "publicacoes_idPet_fkey" FOREIGN KEY ("idPet") REFERENCES "pets"("idPet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_idPubli_fkey" FOREIGN KEY ("idPubli") REFERENCES "publicacoes"("idPubli") ON DELETE RESTRICT ON UPDATE CASCADE;
