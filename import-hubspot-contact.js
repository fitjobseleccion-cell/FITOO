import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /import-hubspot-contact
router.post('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  const { email } = req.body;

  // (1) Validate Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Import attempt with missing or invalid Authorization header');
    return res.status(401).json({
      success: false,
      message: 'Clave de API inválida o faltante',
    });
  }

  const providedApiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
  const expectedApiKey = process.env.IMPORT_API_KEY;

  if (providedApiKey !== expectedApiKey) {
    logger.warn(`Import attempt with invalid API key: ${providedApiKey.substring(0, 10)}...`);
    return res.status(401).json({
      success: false,
      message: 'Clave de API inválida o faltante',
    });
  }

  logger.info('Import request authenticated successfully');

  // (2) Validate email field
  if (!email) {
    logger.warn('Import attempt without email field');
    return res.status(400).json({
      success: false,
      message: 'El campo email es requerido',
    });
  }

  // (6) Map incoming fields to candidatos collection fields
  const mappedData = {
    email: email,
  };

  if (req.body.nombre) {
    mappedData.nombre = req.body.nombre;
  }
  if (req.body.apellido) {
    mappedData.apellidos = req.body.apellido;
  }
  if (req.body.telefono) {
    mappedData.telefono = req.body.telefono;
  }
  if (req.body.ciudad) {
    mappedData.ciudad = req.body.ciudad;
  }
  // Fields to ignore: pais, experiencia, habilidades, linkedin, github, portafolio

  // (3) Search for existing candidate by email
  let existingCandidate = null;
  try {
    existingCandidate = await pb.collection('candidatos').getFirstListItem(`email="${email}"`);
  } catch (error) {
    // Handle 'no records found' gracefully - this is expected for new candidates
    if (error.status === 404 || error.message.includes('no records found')) {
      existingCandidate = null;
    } else {
      // Re-throw other errors to errorMiddleware
      throw new Error(`Failed to search for existing candidate: ${error.message}`);
    }
  }

  if (existingCandidate) {
    // (4) Update existing candidate
    const updatedCandidate = await pb.collection('candidatos').update(existingCandidate.id, mappedData);
    logger.info(`Candidate updated: ${email} (ID: ${updatedCandidate.id})`);
    return res.status(200).json({
      success: true,
      message: 'Candidato importado correctamente',
      action: 'updated',
      candidateId: updatedCandidate.id,
      email: updatedCandidate.email,
    });
  } else {
    // (5) Create new candidate
    const newCandidate = await pb.collection('candidatos').create(mappedData);
    logger.info(`Candidate created: ${email} (ID: ${newCandidate.id})`);
    return res.status(200).json({
      success: true,
      message: 'Candidato importado correctamente',
      action: 'created',
      candidateId: newCandidate.id,
      email: newCandidate.email,
    });
  }
});

export default router;