import 'dotenv/config';
import PocketBase from 'pocketbase';
import logger from './logger.js';

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

const pb = new PocketBase(POCKETBASE_URL);

pb.autoCancellation(false);

let isConnected = false;
let authPromise = null;

// Middleware para autenticación automática de superusuario
pb.beforeSend = async function (url, options) {
  // No autenticar en la ruta de login de superusuario
  if (url.includes('/api/collections/_superusers/auth-with-password')) {
    return { url, options };
  }

  // Si no hay sesión válida y no hay autenticación en progreso, iniciar autenticación
  if (!pb.authStore.isValid && !authPromise) {
    authPromise = pb.collection('_superusers').authWithPassword(
      process.env.PB_SUPERUSER_EMAIL,
      process.env.PB_SUPERUSER_PASSWORD,
    ).catch((err) => {
      logger.error('Failed to authenticate with PocketBase:', err.message);
      throw err;
    }).finally(() => {
      authPromise = null;
    });
  }

  // Esperar a que se complete la autenticación si está en progreso
  if (authPromise) {
    await authPromise;
  }

  // Añadir token de autorización si está disponible
  if (pb.authStore.isValid && pb.authStore.token) {
    options.headers = options.headers || {};
    options.headers['Authorization'] = pb.authStore.token;
  }

  return { url, options };
};

async function waitForHealth({ retries = 10, delayMs = 1000 } = {}) {
  for (let i = 1; i <= retries; i++) {
    try {
      const response = await fetch(`${POCKETBASE_URL}/api/health`, { method: 'HEAD' });
      if (response.ok) {
        return;
      }
    } catch {
      // PocketBase not reachable yet; retry below
    }

    logger.warn(`PocketBase not ready, retrying (${i}/${retries})...`);
    await new Promise((r) => setTimeout(r, delayMs));
  }

  throw new Error(`PocketBase health check failed after ${retries} retries`);
}

async function initPocketBase({ retries = 5, delayMs = 1000 } = {}) {
  try {
    // Esperar a que PocketBase esté listo
    await waitForHealth({ retries, delayMs });

    // Autenticar con superusuario
    if (!pb.authStore.isValid && !authPromise) {
      authPromise = pb.collection('_superusers').authWithPassword(
        process.env.PB_SUPERUSER_EMAIL,
        process.env.PB_SUPERUSER_PASSWORD,
      ).finally(() => {
        authPromise = null;
      });
    }

    if (authPromise) {
      await authPromise;
    }

    isConnected = true;
    logger.info(`[PocketBase] Connected successfully at ${POCKETBASE_URL}`);
    return true;
  } catch (err) {
    logger.error(
      `[PocketBase] Failed to initialize after ${retries} retries at ${POCKETBASE_URL}: ${err.message}`
    );
    isConnected = false;
    return false;
  }
}

function isPocketBaseConnected() {
  return isConnected;
}

export default pb;
export { initPocketBase, isPocketBaseConnected, POCKETBASE_URL };