import jsPDF from "jspdf";
import "jspdf-autotable";

const Comprobante = (reserva) => {
  const doc = new jsPDF();

  // Configuración del fondo gris claro
  doc.setFillColor(200, 200, 200); // Gris claro
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F"); // Llenar el fondo

  // Título "Comprobante de Reserva" centrado
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const title = "Comprobante de Reserva";
  const titleWidth = doc.getTextWidth(title); // Ancho del texto
  doc.text(title, (doc.internal.pageSize.width - titleWidth) / 2, 20); // Centrado

  // Título "Biblioteca Estación Central" centrado
  doc.setFontSize(16);
  const libraryName = "Biblioteca Estación Central";
  const libraryWidth = doc.getTextWidth(libraryName); // Ancho del texto
  doc.text(libraryName, (doc.internal.pageSize.width - libraryWidth) / 2, 30); // Centrado

  // Información del usuario y reserva (en negrita solo los títulos)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Nombre del Usuario:", 20, 50);
  doc.setFont("helvetica", "normal");
  doc.text(reserva.usuario.nombre, 80, 50);

  doc.setFont("helvetica", "bold");
  doc.text("Documento:", 20, 60);
  doc.setFont("helvetica", "normal");
  doc.text(reserva.documento.title, 80, 60);

  doc.setFont("helvetica", "bold");
  doc.text("Código del Préstamo:", 20, 70);
  doc.setFont("helvetica", "normal");
  doc.text(reserva.codigo_pre, 80, 70); // Cambiado a codigo_pre

  doc.setFont("helvetica", "bold");
  doc.text("Fecha de Inicio:", 20, 80);
  doc.setFont("helvetica", "normal");
  doc.text(reserva.fechaInicio, 80, 80);

  doc.setFont("helvetica", "bold");
  doc.text("Fecha de Devolución:", 20, 90);
  doc.setFont("helvetica", "normal");
  doc.text(reserva.fechaDevolucion, 80, 90);

  // Mensaje "Importante"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Importante:", 20, 110);
  doc.setFont("helvetica", "normal");
  doc.text("No olvides devolver el documento en la fecha de devolución,", 20, 120);
  doc.text("se generará una multa por cada día de atraso.", 20, 130);

  // Pie de página "Gracias por su reserva" más grande
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const footerText = "Gracias por su reserva.";
  const footerWidth = doc.getTextWidth(footerText); // Ancho del texto
  doc.text(footerText, (doc.internal.pageSize.width - footerWidth) / 2, 160); // Centrado

  // Guardar el PDF
  doc.save(`comprobante_reserva_BEC:${reserva.codigo_pre}.pdf`); // Cambiado a codigo_pre
};

// Exportación por defecto
export default Comprobante;
