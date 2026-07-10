import express from 'express';
import healthCheck from './health-check.js';
import stripeRouter from './stripe.js';
import contractsRouter from './contracts.js';
import emailRouter from './email.js';
import cvDraftsRouter from './cv-drafts.js';
import importHubspotContactRouter from './import-hubspot-contact.js';
import adminImportRouter from './admin-import.js';

export default function routes() {
  const router = express.Router();
  
  router.get('/health', healthCheck);
  router.use('/stripe', stripeRouter);
  router.use('/contracts', contractsRouter);
  router.use('/email', emailRouter);
  router.use('/cv-drafts', cvDraftsRouter);
  router.use('/import-hubspot-contact', importHubspotContactRouter);
  router.use('/admin', adminImportRouter);
  
  return router;
}