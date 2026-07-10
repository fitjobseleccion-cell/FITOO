import { jsPDF } from 'jspdf';
import logger from './logger.js';

/**
 * Generate a professional PDF contract for service provision (prestación de servicios)
 * @param {Object} contractData - Contract data
 * @param {string} contractData.companyName - Company name
 * @param {string} contractData.cif - Company CIF/Tax ID
 * @param {string} contractData.address - Company address
 * @param {string} contractData.representativeName - Representative name
 * @param {string} contractData.representativeTitle - Representative title/position
 * @param {string} [contractData.contractDate] - Contract date (defaults to today)
 * @param {string} [contractData.clientName] - Client name (defaults to FITJOB)
 * @param {string} [contractData.clientEmail] - Client email
 * @returns {Buffer} PDF buffer
 */
const generateContractPDF = async (contractData) => {
  const {
    companyName,
    cif,
    address,
    representativeName,
    representativeTitle,
    contractDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    clientName = 'FITJOB',
    clientEmail = 'info@fitjob.es',
  } = contractData;

  logger.info(`[PDF Generator] Generating contract PDF for: ${companyName}`);

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with wrapping
  const addWrappedText = (text, x, y, maxWidth, fontSize = 11, options = {}) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y, options);
    return y + lines.length * (fontSize * 0.35);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header - FITJOB Logo/Title
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('FITJOB', margin, yPosition);
  yPosition += 12;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Selección de Personal', margin, yPosition);
  yPosition += 8;

  // Horizontal line
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Title
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText(
    'CONTRATO DE PRESTACIÓN DE SERVICIOS',
    margin,
    yPosition,
    contentWidth,
    14,
    { align: 'center' }
  );
  yPosition += 6;

  // Contract date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    `Fecha: ${contractDate}`,
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 1: Parties
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('1. PARTES CONTRATANTES', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    `De una parte, ${clientName}, empresa especializada en selección de personal y recursos humanos.`,
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 4;

  yPosition = addWrappedText(
    `De otra parte, ${companyName}, con CIF ${cif}, domiciliado en ${address}, representado por ${representativeName}, en su calidad de ${representativeTitle}.`,
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 2: Object
  checkPageBreak(30);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('2. OBJETO DEL CONTRATO', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'El objeto del presente contrato es la prestación de servicios de selección, reclutamiento y colocación de personal, así como asesoramiento en materia de recursos humanos.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 3: Scope of Services
  checkPageBreak(30);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('3. ALCANCE DE LOS SERVICIOS', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const services = [
    'Análisis de necesidades de personal',
    'Búsqueda y preselección de candidatos',
    'Realización de entrevistas y pruebas',
    'Evaluación de competencias',
    'Presentación de candidatos seleccionados',
    'Asesoramiento en el proceso de selección',
  ];

  services.forEach((service) => {
    yPosition = addWrappedText(`• ${service}`, margin + 5, yPosition, contentWidth - 5, 10);
  });
  yPosition += 4;

  // Section 4: Duration
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('4. DURACIÓN DEL CONTRATO', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'El presente contrato tendrá una duración de un (1) año a partir de la fecha de firma, pudiendo ser renovado por acuerdo mutuo de las partes.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 5: Compensation
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('5. COMPENSACIÓN ECONÓMICA', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'La compensación económica por los servicios prestados será acordada según el alcance y complejidad de la búsqueda, siendo facturada según lo establecido en el presupuesto presentado.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 6: Confidentiality
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('6. CONFIDENCIALIDAD', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'Ambas partes se comprometen a mantener la confidencialidad de toda la información intercambiada durante la ejecución del presente contrato.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 7: Intellectual Property
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('7. PROPIEDAD INTELECTUAL', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'Todos los materiales, documentos y análisis generados en el marco de este contrato serán propiedad de FITJOB.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 8: Liability
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('8. RESPONSABILIDAD', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'FITJOB no será responsable de las decisiones finales de contratación tomadas por el cliente, siendo responsabilidad exclusiva del cliente la evaluación final de los candidatos.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 9: Termination
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('9. TERMINACIÓN DEL CONTRATO', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'Cualquiera de las partes podrá rescindir este contrato con treinta (30) días de preaviso por escrito.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 10: Governing Law
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('10. LEY APLICABLE', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'Este contrato se regirá por las leyes de España, siendo competentes los juzgados y tribunales de la jurisdicción correspondiente.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 11: Amendments
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('11. MODIFICACIONES', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'Cualquier modificación del presente contrato deberá ser acordada por escrito y firmada por ambas partes.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 8;

  // Section 12: Entire Agreement
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('12. ACUERDO COMPLETO', margin, yPosition, contentWidth, 11);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    'Este contrato constituye el acuerdo completo entre las partes y reemplaza cualquier acuerdo anterior, ya sea escrito u oral.',
    margin,
    yPosition,
    contentWidth,
    10
  );
  yPosition += 12;

  // Signature section
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  yPosition = addWrappedText('FIRMAS', margin, yPosition, contentWidth, 11, { align: 'center' });
  yPosition += 12;

  // FITJOB signature
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText('Por FITJOB:', margin, yPosition, contentWidth / 2 - 5, 10);
  yPosition += 20;
  doc.line(margin, yPosition, margin + contentWidth / 2 - 10, yPosition);
  yPosition += 4;
  doc.setFontSize(9);
  yPosition = addWrappedText('Firma y sello', margin, yPosition, contentWidth / 2 - 5, 9);

  // Client signature
  yPosition -= 24;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addWrappedText(
    `Por ${companyName}:`,
    margin + contentWidth / 2 + 5,
    yPosition,
    contentWidth / 2 - 5,
    10
  );
  yPosition += 20;
  doc.line(margin + contentWidth / 2 + 5, yPosition, pageWidth - margin, yPosition);
  yPosition += 4;
  doc.setFontSize(9);
  yPosition = addWrappedText(
    'Firma y sello',
    margin + contentWidth / 2 + 5,
    yPosition,
    contentWidth / 2 - 5,
    9
  );

  // Footer
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text(
    `${clientName} | ${clientEmail}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Convert PDF to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  logger.info(`[PDF Generator] Generated contract PDF: ${pdfBuffer.length} bytes`);

  return pdfBuffer;
};

export { generateContractPDF };