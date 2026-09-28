-- CreateTable
CREATE TABLE "curtidas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "publicacaoId" TEXT NOT NULL,

    CONSTRAINT "curtidas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curtidas_usuarioId_publicacaoId_key" ON "curtidas"("usuarioId", "publicacaoId");

-- AddForeignKey
ALTER TABLE "curtidas" ADD CONSTRAINT "curtidas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curtidas" ADD CONSTRAINT "curtidas_publicacaoId_fkey" FOREIGN KEY ("publicacaoId") REFERENCES "publicacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
