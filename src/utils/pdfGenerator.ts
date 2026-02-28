//src/utils/pdfGenerator.ts
import { jsPDF } from 'jspdf';

export const generateInvoicePDF = async (info: any) => {
  const doc = new jsPDF();
  const fontSize = 7;
  const col2X = 58;  // Movido a la izquierda para cerrar el hueco con el logo
  const col3X = 126; // Posición estratégica para balancear las columnas
  const valueOffsetEmisor = 19;  
  const valueOffsetFactura = 24; 
  const lineSpacing = 3.6; // Interlineado más ajustado para evitar amontonamiento
  const pageMarginRight = 200; // Límite del área de impresión derecha
  let currentY = 20;

  doc.setFontSize(fontSize);

  // --- FONDOS GRISES AJUSTADOS (Menos alto y hasta el margen) ---
  doc.setFillColor(215, 215, 215);
  // Franja EMISOR
  doc.rect(col2X, currentY - 3.5, 65, 4, 'F'); 
  // Franja FACTURA (Llega hasta el margen derecho de la página)
  const facturaHeaderWidth = pageMarginRight - col3X;
  doc.rect(col3X, currentY - 3.5, facturaHeaderWidth, 4, 'F');

  // --- FUNCIÓN DE DIBUJO DE PRECISIÓN ---
  const drawRow = (label: string, value: string, x: number, offset: number, y: number, width: number) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, x, y);
    doc.setFont("helvetica", "normal");
    
    const splitText = doc.splitTextToSize(String(value || ""), width);
    doc.text(splitText, x + offset, y);
    
    // Solo devuelve el alto extra si hay salto de línea real
    return (splitText.length > 1) ? (splitText.length - 1) * lineSpacing : 0;
  };

  // --- COLUMNA 2: EMISOR ---
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("EMISOR", col2X, currentY); 
  
  let emisorY = currentY + lineSpacing + 1;
  emisorY += drawRow("Razón Social:", info.nombre_emisor, col2X, valueOffsetEmisor, emisorY, 45) + lineSpacing;
  emisorY += drawRow("RFC:", info.rfc_emisor, col2X, valueOffsetEmisor, emisorY, 45) + lineSpacing;
  emisorY += drawRow("Régimen Fiscal:", info.regimen_emisor, col2X, valueOffsetEmisor, emisorY, 45) + lineSpacing;
  emisorY += drawRow("Dirección:", `C.P. ${info.lugar_exp}`, col2X, valueOffsetEmisor, emisorY, 45);

  // --- COLUMNA 3: FACTURA ---
  let facturaY = 20; 
  doc.setFont("helvetica", "bold");
  doc.text("FACTURA", col3X, facturaY);
  
  // Serie y Folio (Alineados con el contenido de abajo)
  doc.setTextColor(180, 0, 0);
  doc.text(`${String(info.serie || "")} ${String(info.folio || "")}`, col3X + valueOffsetFactura, facturaY);
  
  doc.setTextColor(0, 0, 0);
  facturaY += lineSpacing + 1;

  // El ancho para el contenido de Factura ahora es de 50mm para asegurar que el UUID no salte
  const contentWidthFactura = 50;

  facturaY += drawRow("Tipo Comprobante:", info.tipo, col3X, valueOffsetFactura, facturaY, contentWidthFactura) + lineSpacing;
  
  // UUID: Con 50mm de ancho y fuente de 7pt, el formato xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx no debería saltar
  facturaY += drawRow("Folio (UUID):", info.uuid, col3X, valueOffsetFactura, facturaY, contentWidthFactura) + lineSpacing;
  
  facturaY += drawRow("Fecha Emisión:", info.fecha, col3X, valueOffsetFactura, facturaY, contentWidthFactura) + lineSpacing;
  facturaY += drawRow("Método de Pago:", info.metodo_pago, col3X, valueOffsetFactura, facturaY, contentWidthFactura) + lineSpacing;
  facturaY += drawRow("Forma de Pago:", info.forma_pago, col3X, valueOffsetFactura, facturaY, contentWidthFactura) + lineSpacing;
  facturaY += drawRow("Uso de CFDI:", info.uso_cfdi, col3X, valueOffsetFactura, facturaY, contentWidthFactura) + lineSpacing;
  facturaY += drawRow("Exportación:", info.exportacion, col3X, valueOffsetFactura, facturaY, contentWidthFactura);

  return doc.output('blob');
};