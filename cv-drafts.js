import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /load
// Load CV draft from PocketBase by userId
router.get('/load', async (req, res) => {
  const { userId } = req.query;

  // Validate required fields
  if (!userId) {
    return res.status(400).json({
      error: 'Missing required query parameter: userId',
    });
  }

  // Fetch draft for this user
  let draft = null;
  try {
    draft = await pb.collection('cv_drafts').getFirstListItem(`userId = "${userId}"`);
  } catch (error) {
    // Handle 'no records found' gracefully
    if (error.status === 404 || error.message.includes('no records found')) {
      logger.info(`No CV draft found for user: ${userId}`);
      return res.status(200).json({
        formData: null,
        updatedAt: null,
      });
    }
    // Re-throw other errors to errorMiddleware
    throw error;
  }

  let parsedFormData = null;

  try {
    parsedFormData = typeof draft.formData === 'string' ? JSON.parse(draft.formData) : draft.formData;
  } catch (error) {
    logger.warn(`Failed to parse formData for draft ${draft.id}: ${error.message}`);
    parsedFormData = draft.formData;
  }

  logger.info(`CV draft loaded for user: ${userId}, draftId: ${draft.id}`);

  res.status(200).json({
    formData: parsedFormData,
    updatedAt: draft.updated,
  });
});

// POST /save
// Save or update CV draft in PocketBase
router.post('/save', async (req, res) => {
  const { userId, formData } = req.body;

  // Validate required fields
  if (!userId || !formData) {
    return res.status(400).json({
      error: 'Missing required fields: userId, formData',
    });
  }

  // Check if draft already exists for this user
  let existingDraft = null;
  try {
    existingDraft = await pb.collection('cv_drafts').getFirstListItem(`userId = "${userId}"`);
  } catch (error) {
    // Handle 'no records found' gracefully - this is expected for new drafts
    if (error.status === 404 || error.message.includes('no records found')) {
      existingDraft = null;
    } else {
      // Re-throw other errors to errorMiddleware
      throw error;
    }
  }

  const updatedAt = new Date().toISOString();
  let statusCode = 200;

  if (existingDraft) {
    // Update existing draft
    const updatedRecord = await pb.collection('cv_drafts').update(existingDraft.id, {
      userId,
      formData: typeof formData === 'string' ? formData : JSON.stringify(formData),
      updated: updatedAt,
    });
    logger.info(`CV draft updated for user: ${userId}, draftId: ${updatedRecord.id}`);
    statusCode = 200;
  } else {
    // Create new draft
    const newRecord = await pb.collection('cv_drafts').create({
      userId,
      formData: typeof formData === 'string' ? formData : JSON.stringify(formData),
      updated: updatedAt,
    });
    logger.info(`CV draft created for user: ${userId}, draftId: ${newRecord.id}`);
    statusCode = 201;
  }

  res.status(statusCode).json({
    success: true,
    updatedAt,
  });
});

export default router;