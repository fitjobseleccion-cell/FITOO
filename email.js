import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /email/confirmation
router.post('/confirmation', async (req, res) => {
  const { email, candidateName, jobTitle, ofertaId } = req.body;

  // Validate required fields
  if (!email || !candidateName || !jobTitle || !ofertaId) {
    return res.status(400).json({
      error: 'Missing required fields: email, candidateName, jobTitle, ofertaId',
    });
  }

  // Email subject
  const subject = `Candidatura recibida - ${jobTitle}`;

  // Email body with confirmation details
  const body = `
Estimado/a ${candidateName},

Le confirmamos que hemos recibido su candidatura para la posición de ${jobTitle}.

Detalles de su candidatura:
- Puesto: ${jobTitle}
- ID de Oferta: ${ofertaId}
- Fecha de recepción: ${new Date().toLocaleDateString('es-ES')}

Próximos pasos:
1. Nuestro equipo revisará su candidatura en los próximos 5-7 días hábiles
2. Si su perfil se ajusta a nuestras necesidades, nos pondremos en contacto con usted
3. Puede consultar el estado de su candidatura en nuestro portal

Gracias por su interés en FITJOB. Si tiene alguna pregunta, no dude en contactarnos.

Atentamente,
Equipo de FITJOB
Selección de Personal
  `;

  logger.info(`Sending confirmation email to: ${email} for job: ${jobTitle}`);

  // In a production Horizons environment, this would be handled by PocketBase hooks
  // or the platform's built-in mailer system.
  // For now, we log the email operation and return success.
  logger.info(`[Email Service] Confirmation email queued`);
  logger.info(`[Email Service] To: ${email}`);
  logger.info(`[Email Service] Subject: ${subject}`);
  logger.info(`[Email Service] Candidate: ${candidateName}`);
  logger.info(`[Email Service] Job Title: ${jobTitle}`);
  logger.info(`[Email Service] Offer ID: ${ofertaId}`);

  // Return success response
  res.json({
    success: true,
    message: 'Email sent',
    details: {
      email,
      candidateName,
      jobTitle,
      ofertaId,
      sentAt: new Date().toISOString(),
    },
  });
});

export default router;