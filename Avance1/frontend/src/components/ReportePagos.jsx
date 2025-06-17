import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatoCLP = (num) =>
  num !== undefined
    ? new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(num)
    : "";

const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const [año, mes, dia] = fecha.split('T')[0].split('-');
    return `${dia}/${mes}/${año}`;
  };
  
const ReportePagosPDF = (pagos) => {
  const pagosPagados = pagos.filter(p => p.estado === "pagado");
  const pagosPendientes = pagos.filter(p => p.estado === "pendiente");

  const doc = new jsPDF("p", "mm", "a4");

  // Título general
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Reporte de Pagos", 105, 20, { align: "center" });

  // Empresa o sistema
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema ComuniRed", 105, 28, { align: "center" });

  let currentY = 40;

  // Tabla: Pagos realizados
  autoTable(doc, {
    startY: currentY,
    head: [["RUT", "Nombre", "Apellido", "Descripción", "Monto", "F. Emisión", "F. Vencimiento"]],
    body: pagosPagados.map((p) => [
      p.user?.rut || "—",
      p.user?.firstName || "—",
      p.user?.lastName || "—",
      p.descripcion || "—",
      formatoCLP(p.monto_total),
      formatearFecha(p.fecha_emision),
      formatearFecha(p.fecha_vencimiento),
    ]),
    theme: "grid",
    headStyles: { fillColor: [46, 204, 113] }, // verde
    styles: { fontSize: 9 },
    margin: { left: 10, right: 10 },
    didDrawPage: (data) => {
      currentY = data.cursor.y + 10;
    },
  });

  // Tabla: Pagos pendientes
  autoTable(doc, {
    startY: currentY,
    head: [["RUT", "Nombre", "Apellido", "Descripción", "Monto", "F. Emisión", "F. Vencimiento"]],
    body: pagosPendientes.map((p) => [
      p.user?.rut || "—",
      p.user?.firstName || "—",
      p.user?.lastName || "—",
      p.descripcion || "—",
      formatoCLP(p.monto_total),
      formatearFecha(p.fecha_emision),
      formatearFecha(p.fecha_vencimiento),
    ]),
    theme: "grid",
    headStyles: { fillColor: [231, 76, 60] }, // rojo
    styles: { fontSize: 9 },
    margin: { left: 10, right: 10 },
  });

  doc.save("reporte_pagos_comunired.pdf");
};

export default ReportePagosPDF;
