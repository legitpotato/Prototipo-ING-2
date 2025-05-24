-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "monto_original" DOUBLE PRECISION NOT NULL,
    "interes_acumulado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monto_total" DOUBLE PRECISION NOT NULL,
    "cuenta_destino" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rut" TEXT NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_rut_fkey" FOREIGN KEY ("rut") REFERENCES "User"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;
