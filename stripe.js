import express from 'express';
import Stripe from 'stripe';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Service ID to Stripe Price ID mapping using environment variables
const priceMap = {
  'cv-automatico': process.env.STRIPE_PRICE_CV_AUTOMATICO,
  'revision-reclutador': process.env.STRIPE_PRICE_REVISION_RECLUTADOR,
  'cv-carta': process.env.STRIPE_PRICE_CV_CARTA,
  'pack-premium': process.env.STRIPE_PRICE_PACK_PREMIUM,
  'plan-basico': process.env.STRIPE_PRICE_PLAN_BASICO,
  'plan-empresa': process.env.STRIPE_PRICE_PLAN_EMPRESA,
  'plan-seleccion': process.env.STRIPE_PRICE_PLAN_SELECCION,
};

// POST /stripe/create-checkout
// Create Checkout Session with serviceId and userId
router.post('/create-checkout', async (req, res) => {
  const { serviceId, userId } = req.body;

  // Validate required fields
  if (!serviceId || !userId) {
    return res.status(400).json({
      error: 'Missing required fields: serviceId, userId',
    });
  }

  // Validate serviceId is in the mapping
  if (!priceMap[serviceId]) {
    return res.status(400).json({
      error: `Invalid serviceId. Must be one of: ${Object.keys(priceMap).join(', ')}`,
    });
  }

  // Get priceId from mapping
  const priceId = priceMap[serviceId];

  // DEFENSIVE VALIDATION: Ensure price is configured
  if (!priceId) {
    return res.status(400).json({
      error: `Precio no configurado para el servicio: ${serviceId}. Verifica que la variable de entorno STRIPE_PRICE_${serviceId.toUpperCase().replace(/-/g, '_')} está definida.`,
    });
  }

  // Fetch user from PocketBase to get email
  const user = await pb.collection('users').getOne(userId);

  if (!user || !user.email) {
    throw new Error(`User not found or has no email: ${userId}`);
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: user.email,
    success_url: 'https://fitjob.es/cv-generator?payment=success',
    cancel_url: 'https://fitjob.es/cv-generator?payment=cancelled',
    metadata: {
      userId,
      serviceId,
    },
  });

  logger.info(`Checkout session created: ${session.id} for user: ${userId}, service: ${serviceId}`);

  res.json({ url: session.url });
});

// POST /stripe/webhook
// Handle Stripe webhook events
// Note: This route uses express.raw() to receive raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  if (!sig) {
    logger.error('Stripe signature missing from webhook request');
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    logger.error('Webhook signature verification failed:', error.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${error.message}` });
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const { userId, serviceId } = session.metadata || {};

    if (!userId || !serviceId) {
      logger.warn(`Webhook received without userId or serviceId: ${session.id}`);
      return res.json({ received: true });
    }

    // Create payment record in PocketBase
    const paymentRecord = await pb.collection('payments').create({
      stripeSessionId: session.id,
      userId,
      serviceId,
      amount: session.amount_total / 100,
      currency: session.currency,
      status: 'completed',
      timestamp: new Date().toISOString(),
    });

    logger.info(`Payment recorded in PocketBase: ${paymentRecord.id} for user: ${userId}, service: ${serviceId}`);
  }

  res.json({ received: true });
});

export default router;