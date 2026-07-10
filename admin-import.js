import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import { verifyAdminEmail } from '../middleware/verifyAdminEmail.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /import-csv/batch
// Batch import candidaturas from CSV rows
router.post('/import-csv/batch', verifyAdminEmail, async (req, res) => {
  const { rows } = req.body;

  // Validate required field - ONLY acceptable manual res.status(400) call
  if (!rows || !Array.isArray(rows)) {
    return res.status(400).json({
      error: 'Invalid request',
    });
  }

  const imported = [];
  const skipped = [];
  const errors = [];

  // Process each row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowIndex = i + 1; // 1-based index for user-friendly error messages

    // Validate required fields - trim whitespace
    const nombre = row.nombre ? String(row.nombre).trim() : '';
    const apellidos = row.apellidos ? String(row.apellidos).trim() : '';
    const email = row.email ? String(row.email).trim() : '';
    const telefono = row.telefono ? String(row.telefono).trim() : '';

    // Check all required fields are present and non-empty
    if (!nombre || !apellidos || !email) {
      skipped.push({
        rowIndex,
        reason: 'Missing required fields: nombre, apellidos, email',
        data: row,
      });
      logger.info(`Row ${rowIndex} skipped: missing required fields`);
      continue;
    }

    // Attempt to create candidatura record
    try {
      const candidatura = await pb.collection('candidaturas').create({
        nombre,
        apellidos,
        email,
        telefono,
      });

      imported.push({
        rowIndex,
        candidaturaId: candidatura.id,
        email: candidatura.email,
      });

      logger.info(`Candidatura imported: ${candidatura.email} (ID: ${candidatura.id})`);
    } catch (error) {
      // Check if error is due to duplicate email (unique constraint violation)
      const isDuplicateEmail = error.message && error.message.toLowerCase().includes('duplicate');

      if (isDuplicateEmail) {
        skipped.push({
          rowIndex,
          reason: `Email already exists: ${email}`,
          data: row,
        });
        logger.info(`Row ${rowIndex} skipped: duplicate email ${email}`);
      } else {
        // Other errors go to errors array
        errors.push({
          rowIndex,
          error: error.message,
          data: row,
        });
        logger.error(`Row ${rowIndex} error: ${error.message}`);
      }
    }
  }

  logger.info(`Batch import completed: ${imported.length} imported, ${skipped.length} skipped, ${errors.length} errors`);

  res.json({
    imported: imported.length,
    skipped: skipped.length,
    errors,
  });
});

// POST /import-csv/log
// Log import operation to import_logs collection
router.post('/import-csv/log', verifyAdminEmail, async (req, res) => {
  const { fileName, totalRows, imported, skipped, errors } = req.body;

  // Validate all required fields are present
  if (
    fileName === undefined ||
    totalRows === undefined ||
    imported === undefined ||
    skipped === undefined ||
    !Array.isArray(errors)
  ) {
    throw new Error('Missing required fields: fileName, totalRows, imported, skipped, errors');
  }

  // Create import log record in PocketBase
  const logRecord = await pb.collection('import_logs').create({
    fileName,
    totalRows,
    imported,
    skipped,
    errors,
  });

  logger.info(`Import log created: ${logRecord.id}`);
  logger.info(`Import summary: ${imported} imported, ${skipped} skipped, ${errors.length} errors out of ${totalRows} total rows`);

  res.json({
    success: true,
    logId: logRecord.id,
  });
});

export default router;