import express from 'express';
import pb from '../utils/pocketbase.js';
import { generateContractPDF } from '../utils/pdfGenerator.js';
import { sendContractEmail } from '../utils/emailService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /contracts/generate
router.post('/generate', async (req, res) => {
  const {
    companyName,
    cif,
    address,
    representativeName,
    representativeTitle,
    email,
    phone,
    position,
    vacancies,
    amount,
    stripeSessionId,
  } = req.body;

  // Validate required fields
  const requiredFields = [
    'companyName',
    'cif',
    'address',
    'representativeName',
    'representativeTitle',
    'email',
    'phone',
    'position',
    'vacancies',
    'amount',
    'stripeSessionId',
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // Generate PDF
  const pdfBuffer = await generateContractPDF({
    companyName,
    cif,
    address,
    representativeName,
    representativeTitle,
  });

  // Save contract to PocketBase
  const contractRecord = await pb.collection('contracts').create({
    companyName,
    cif,
    address,
    representativeName,
    representativeTitle,
    email,
    phone,
    position,
    vacancies,
    amount,
    stripeSessionId,
    pdfPath: `contracts/${companyName}_${Date.now()}.pdf`,
    createdAt: new Date().toISOString(),
  });

  logger.info(`Contract created with ID: ${contractRecord.id}`);

  // Return PDF as response
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const filename = `CONTRATO_FITJOB_${(companyName || 'contract').replace(/\s+/g, '_').toUpperCase()}_${currentDate}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.send(pdfBuffer);
});

// POST /contracts/send-email
router.post('/send-email', async (req, res) => {
  const {
    contractId,
    email,
    companyName,
    cif,
    representativeName,
    phone,
    position,
    vacancies,
    amount,
  } = req.body;

  // Validate required fields
  const requiredFields = [
    'contractId',
    'email',
    'companyName',
    'cif',
    'representativeName',
    'phone',
    'position',
    'vacancies',
    'amount',
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // Retrieve contract from PocketBase
  const contract = await pb.collection('contracts').getOne(contractId);

  // Generate PDF buffer
  const pdfBuffer = await generateContractPDF({
    companyName,
    cif,
    address: contract.address || '',
    representativeName,
    representativeTitle: contract.representativeTitle || '',
  });

  // Send email
  const emailResult = await sendContractEmail({
    email,
    companyName,
    cif,
    representativeName,
    phone,
    position,
    vacancies,
    amount,
    pdfBuffer,
  });

  res.json({
    success: true,
    messageId: emailResult.messageId,
  });
});

// GET /contracts/preview/:contractId
router.get('/preview/:contractId', async (req, res) => {
  const { contractId } = req.params;

  // Retrieve contract from PocketBase
  const contract = await pb.collection('contracts').getOne(contractId);

  if (!contract || !contract.id) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Generate PDF with stored contract data
  const pdfBuffer = await generateContractPDF({
    companyName: contract.companyName || '',
    cif: contract.cif || '',
    address: contract.address || '',
    representativeName: contract.representativeName || '',
    representativeTitle: contract.representativeTitle || '',
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=CONTRATO_PREVIEW.pdf');
  res.send(pdfBuffer);
});

// GET /contracts/download/:contractId
router.get('/download/:contractId', async (req, res) => {
  const { contractId } = req.params;

  // Retrieve contract from PocketBase
  const contract = await pb.collection('contracts').getOne(contractId);

  if (!contract || !contract.id) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Generate PDF with stored contract data
  const pdfBuffer = await generateContractPDF({
    companyName: contract.companyName || '',
    cif: contract.cif || '',
    address: contract.address || '',
    representativeName: contract.representativeName || '',
    representativeTitle: contract.representativeTitle || '',
  });

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const filename = `CONTRATO_FITJOB_${(contract.companyName || 'contract').replace(/\s+/g, '_').toUpperCase()}_${currentDate}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.send(pdfBuffer);
});

export default router;