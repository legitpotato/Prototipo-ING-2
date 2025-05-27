import jsPDF from "jspdf";
import "jspdf-autotable";

const ComprobantePago = (comprobante) => {
  //console.log("ComprobantePago recibió:", comprobante);
  //console.log("User dentro del comprobante:", comprobante.user);

  const doc = new jsPDF();

  // Fondo gris claro
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");

  // Título
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const title = "Comprobante de Pago";
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (doc.internal.pageSize.width - titleWidth) / 2, 20);

  // Subtítulo o nombre de la comunidad/empresa
  doc.setFontSize(14);
  const companyName = "ComuniRed - Gestión de Pagos";
  const companyWidth = doc.getTextWidth(companyName);
  doc.text(companyName, (doc.internal.pageSize.width - companyWidth) / 2, 30);

  // Datos del pago - Etiquetas en negrita, datos normales
  let y = 45;
  const lineHeight = 10;

  const writeLabelValue = (label, value) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value ?? ""), 70, y);
    y += lineHeight;
  };

  // Formateador de moneda chilena
  const formatoCLP = (num) =>
    num !== undefined ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(num) : "";

  writeLabelValue("RUT", comprobante.user?.rut ?? "");
  writeLabelValue("Nombre", `${comprobante.user?.firstName ?? ""} ${comprobante.user?.lastName ?? ""}`.trim());
  writeLabelValue("Descripción", comprobante.descripcion ?? "");
  writeLabelValue("Monto Original", formatoCLP(comprobante.monto_original));
  writeLabelValue("Interés Acumulado", formatoCLP(comprobante.interes_acumulado));
  writeLabelValue("Monto Total", formatoCLP(comprobante.monto_total));

  // Fecha y hora formateada
  const fechaEmision = comprobante.fecha_emision ? new Date(comprobante.fecha_emision) : null;
  writeLabelValue("Fecha y Hora", fechaEmision ? fechaEmision.toLocaleString() : "");

  const fechaVencimiento = comprobante.fecha_vencimiento ? new Date(comprobante.fecha_vencimiento) : null;
  writeLabelValue("Fecha Vencimiento", fechaVencimiento ? fechaVencimiento.toLocaleDateString() : "");

  writeLabelValue("Cuenta Destino", comprobante.cuenta_destino ?? "");
  writeLabelValue("Estado", comprobante.estado ?? "");

  // Pie de página
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  const footerText = "Gracias por su pago. ¡ComuniRed te agradece!";
  const footerWidth = doc.getTextWidth(footerText);
  doc.text(footerText, (doc.internal.pageSize.width - footerWidth) / 2, y + 15);

  // Guardar el PDF con nombre dinámico
  doc.save(`comprobante_pago_${comprobante.id ?? "sin_id"}.pdf`);
};

export default ComprobantePago;
