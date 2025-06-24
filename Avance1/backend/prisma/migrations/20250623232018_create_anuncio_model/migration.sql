-- CreateTable
CREATE TABLE "Anuncio" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipoAnuncio" TEXT NOT NULL,
    "permitirComentarios" BOOLEAN NOT NULL DEFAULT true,
    "permitirReacciones" BOOLEAN NOT NULL DEFAULT true,
    "soloLectura" BOOLEAN NOT NULL DEFAULT false,
    "fechaReunion" TIMESTAMP(3),
    "plataforma" TEXT,
    "enlaceReunion" TEXT,
    "comunidadId" INTEGER NOT NULL,
    "creadorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anuncio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Anuncio" ADD CONSTRAINT "Anuncio_comunidadId_fkey" FOREIGN KEY ("comunidadId") REFERENCES "Comunidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anuncio" ADD CONSTRAINT "Anuncio_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
