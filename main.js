import 'dotenv/config';
import { initPocketBase } from './utils/pocketbase.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.js';
import { globalRateLimit } from './middleware/global-rate-limit.js';
import logger from './utils/logger.js';
import { BodyLimit } from './constants/common.js';

const app = express();

app.set('trust proxy', true);

process.on('uncaughtException', (error) => {
	logger.error('Uncaught exception:', error);
});
  
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', async () => {
	logger.info('Interrupted');
	process.exit(0);
});

process.on('SIGTERM', async () => {
	logger.info('SIGTERM signal received');

	await new Promise(resolve => setTimeout(resolve, 3000));

	logger.info('Exiting');
	process.exit();
});

app.use(helmet());

// ============================================================================
// CORS CONFIGURATION
// ============================================================================
const corsOrigins = [
	'http://localhost:3000',
	'https://fitjob.es',
	'https://fef788d4-bd8f-4390-bd66-3c5ee3fa2ae2.app-preview.com',
];

logger.info('\n========== CORS CONFIGURATION ==========' );
logger.info('Allowed Origins:');
corsOrigins.forEach((origin) => {
	logger.info(`  ✓ ${origin}`);
});
logger.info('========================================\n');

app.use(cors({
	origin: corsOrigins,
	credentials: true,
}));
// ============================================================================

app.use(morgan('combined'));
app.use(globalRateLimit);
app.use(express.json({
	limit: BodyLimit,
}));
app.use(express.urlencoded({ 
	extended: true,
	limit: BodyLimit,
}));

// Normaliza el prefijo que añade el proxy de Horizons (/hcgi/api -> /api)
// para que las rutas coincidan sin importar cómo reenvíe la petición el proxy.
app.use((req, res, next) => {
	if (req.url.startsWith('/hcgi/api')) {
		req.url = req.url.replace('/hcgi/api', '/api');
	}
	next();
});

// ============================================================================
// DIAGNÓSTICO DE VARIABLES DE ENTORNO - STRIPE PRICE IDs
// ============================================================================
logger.info('\n========== STRIPE PRICE IDs CONFIGURATION ==========' );
logger.info('STRIPE_PRICE_CV_AUTOMATICO:', process.env.STRIPE_PRICE_CV_AUTOMATICO ? '✓ Cargada' : '✗ NO cargada');
logger.info('STRIPE_PRICE_REVISION_RECLUTADOR:', process.env.STRIPE_PRICE_REVISION_RECLUTADOR ? '✓ Cargada' : '✗ NO cargada');
logger.info('STRIPE_PRICE_CV_CARTA:', process.env.STRIPE_PRICE_CV_CARTA ? '✓ Cargada' : '✗ NO cargada');
logger.info('STRIPE_PRICE_PACK_PREMIUM:', process.env.STRIPE_PRICE_PACK_PREMIUM ? '✓ Cargada' : '✗ NO cargada');
logger.info('STRIPE_PRICE_PLAN_BASICO:', process.env.STRIPE_PRICE_PLAN_BASICO ? '✓ Cargada' : '✗ NO cargada');
logger.info('STRIPE_PRICE_PLAN_EMPRESA:', process.env.STRIPE_PRICE_PLAN_EMPRESA ? '✓ Cargada' : '✗ NO cargada');
logger.info('STRIPE_PRICE_PLAN_SELECCION:', process.env.STRIPE_PRICE_PLAN_SELECCION ? '✓ Cargada' : '✗ NO cargada');
logger.info('====================================================\n');
// ============================================================================

logger.info('\n========== ROUTE REGISTRATION ==========' );
logger.info('Registering routes at /api prefix');
logger.info('Available endpoints:');
logger.info('  ✓ GET /api/health');
logger.info('  ✓ POST /api/stripe/create-checkout');
logger.info('  ✓ POST /api/stripe/webhook');
logger.info('  ✓ POST /api/contracts/generate');
logger.info('  ✓ POST /api/contracts/send-email');
logger.info('  ✓ GET /api/contracts/preview/:contractId');
logger.info('  ✓ GET /api/contracts/download/:contractId');
logger.info('  ✓ POST /api/email/confirmation');
logger.info('  ✓ GET /api/cv-drafts/load');
logger.info('  ✓ POST /api/cv-drafts/save');
logger.info('========================================\n');

app.use('/api', routes());

app.use(errorMiddleware); 
app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
	logger.info(`🚀 API Server running on http://localhost:${port}`);
});

initPocketBase({ retries: 20, delayMs: 1500 });

export default app;