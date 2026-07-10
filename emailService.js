import logger from './logger.js';

/**
 * Email Service Stub
 * 
 * Email sending is handled by the Horizons platform integration.
 * This stub logs email operations to console instead of using SMTP/nodemailer.
 * 
 * In a production Horizons environment, emails are sent through the platform's
 * built-in mailer system via PocketBase hooks or platform APIs.
 */

const sendEmail = async (data) => {
  const {
    email,
    subject,
    body,
    attachments,
  } = data;

  logger.info(`[Email Stub] Sending email to: ${email}`);
  logger.info(`[Email Stub] Subject: ${subject}`);
  logger.info(`[Email Stub] Body: ${body}`);
  
  if (attachments && attachments.length > 0) {
    logger.info(`[Email Stub] Attachments: ${attachments.map(a => a.filename).join(', ')}`);
  }

  // Simulate successful email send
  return {
    success: true,
    messageId: `stub_${Date.now()}`,
    email,
    timestamp: new Date().toISOString(),
  };
};

const sendContractEmail = async (data) => {
  const {
    email,
    companyName,
    cif,
    representativeName,
    phone,
    position,
    vacancies,
    amount,
    pdfBuffer,
  } = data;

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const emailBody = `
Estimado/a ${representativeName},

Le confirmamos la activación de nuestro servicio de selección de personal. A continuación, encontrará los detalles de su solicitud:

Datos de la Empresa:
- Nombre de la Empresa: ${companyName}
- CIF: ${cif}
- Persona de Contacto: ${representativeName}
- Email: ${email}
- Teléfono: ${phone}
- Puesto a Cubrir: ${position}
- Número de Vacantes: ${vacancies}
- Monto de Activación: ${amount}€

Adjunto encontrará el contrato de prestación de servicios que debe ser firmado por ambas partes.

Por favor, revise el contrato y devuélvalo firmado a la mayor brevedad posible.

Quedamos a su disposición para cualquier duda o aclaración.

Atentamente,
FITJOB
Selección de Personal
  `;

  const filename = `CONTRATO_FITJOB_${companyName.replace(/\s+/g, '_').toUpperCase()}_${currentDate}.pdf`;

  logger.info(`[Email Stub] Sending contract email to: ${email}`);
  logger.info(`[Email Stub] Company: ${companyName}, CIF: ${cif}`);
  logger.info(`[Email Stub] Attachment: ${filename}`);
  logger.info(`[Email Stub] PDF Buffer size: ${pdfBuffer ? pdfBuffer.length : 0} bytes`);

  // Simulate successful email send
  return {
    success: true,
    messageId: `stub_${Date.now()}`,
    email,
    timestamp: new Date().toISOString(),
  };
};

export { sendEmail, sendContractEmail };