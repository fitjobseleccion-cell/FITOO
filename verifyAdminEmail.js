import pb from '../utils/pocketbase.js';
import Pocketbase from 'pocketbase';
import logger from '../utils/logger.js';

const verifyAdminEmail = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // (1) Check for Authorization header with Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Missing or invalid Authorization header');
    return res.status(403).json({
      error: 'Missing or invalid Authorization header',
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // (2) Create a new Pocketbase instance and authenticate with the token
    const pbInstance = new Pocketbase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
    pbInstance.authStore.save(token);

    // (3) Call authRefresh() to get user data
    const authData = await pbInstance.collection('users').authRefresh();

    // (4) Verify the email matches 'frangonzalezfitjob@gmail.com' (case-insensitive)
    const userEmail = authData.record.email.toLowerCase();
    const expectedEmail = 'frangonzalezfitjob@gmail.com'.toLowerCase();

    if (userEmail !== expectedEmail) {
      logger.warn(`Unauthorized email: ${userEmail}`);
      return res.status(403).json({
        error: 'Unauthorized email',
      });
    }

    // (5) Attach authenticatedEmail to req object and call next() on success
    req.authenticatedEmail = userEmail;
    next();
  } catch (error) {
    // (6) Return 403 status for invalid/expired token
    logger.error(`Token verification failed: ${error.message}`);
    return res.status(403).json({
      error: 'Invalid or expired token',
    });
  }
};

export { verifyAdminEmail };