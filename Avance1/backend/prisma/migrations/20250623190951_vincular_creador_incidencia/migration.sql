-- CreateEnum
CREATE TYPE "Importancia" AS ENUM ('Alta', 'Media', 'Baja');

-- CreateEnum
CREATE TYPE "EstadoIncidencia" AS ENUM ('Nuevo', 'EnProceso', 'Resuelto');

-- CreateTable
CREATE TABLE "Incidencia" (
    "id" SERIAL NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "importancia" "Importancia" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoIncidencia" NOT NULL,
    "fotos" TEXT[],
    "comunidadId" INTEGER NOT NULL,
    "creadorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incidencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_comunidadId_fkey" FOREIGN KEY ("comunidadId") REFERENCES "Comunidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
