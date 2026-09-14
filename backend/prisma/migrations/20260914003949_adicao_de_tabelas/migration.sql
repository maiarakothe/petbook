-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "tipo_animal" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "localizacao" TEXT NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicacoes" (
    "id" TEXT NOT NULL,
    "legenda" TEXT NOT NULL,

    CONSTRAINT "publicacoes_pkey" PRIMARY KEY ("id")
);
