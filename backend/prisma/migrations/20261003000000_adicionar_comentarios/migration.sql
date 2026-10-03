CREATE TABLE "comentarios" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "publicacaoId" TEXT NOT NULL,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "comentarios_publicacaoId_criadoEm_idx"
ON "comentarios"("publicacaoId", "criadoEm");

ALTER TABLE "comentarios"
ADD CONSTRAINT "comentarios_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comentarios"
ADD CONSTRAINT "comentarios_publicacaoId_fkey"
FOREIGN KEY ("publicacaoId") REFERENCES "publicacoes"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
