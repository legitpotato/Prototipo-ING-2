/*
  Warnings:

  - Added the required column `comunidadId` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('VECINO', 'DIRECTIVA', 'CONSERJE', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoMiembro" AS ENUM ('ACTIVO', 'INACTIVO', 'PENDIENTE');

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "comunidadId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Comunidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comunidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioComunidad" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "comunidadId" INTEGER NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "estado" "EstadoMiembro" NOT NULL DEFAULT 'ACTIVO',
    "fechaUnion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioComunidad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioComunidad_userId_comunidadId_key" ON "UsuarioComunidad"("userId", "comunidadId");

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_comunidadId_fkey" FOREIGN KEY ("comunidadId") REFERENCES "Comunidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioComunidad" ADD CONSTRAINT "UsuarioComunidad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioComunidad" ADD CONSTRAINT "UsuarioComunidad_comunidadId_fkey" FOREIGN KEY ("comunidadId") REFERENCES "Comunidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
