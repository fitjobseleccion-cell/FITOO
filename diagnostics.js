import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /diagnostics
// Returns infrastructure debugging information
router.post('/', async (req, res) => {
  // Extract registered routes from Express app
  const routes = [];
  const app = req.app;

  if (app._router && app._router.stack) {
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // Single route
        const methods = Object.keys(middleware.route.methods);
        methods.forEach((method) => {
          routes.push(`${method.toUpperCase()} ${middleware.route.path}`);
        });
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        // Router middleware (nested routes)
        const prefix = middleware.regexp
          .source.replace(/\\\//g, '/')
          .replace(/\?(?:=\\\/|$)/g, '')
          .replace(/^\/\^/, '')
          .replace(/\$\/$/, '')
          .replace(/\\\//g, '/');

        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods);
            methods.forEach((method) => {
              const fullPath = prefix + handler.route.path;
              routes.push(`${method.toUpperCase()} ${fullPath}`);
            });
          }
        });
      }
    });
  }

  // Get recent logs from global
  const recentLogs = global.recentLogs || [];

  // Get server start time
  const serverStartTime = global.serverStartTime || new Date().toISOString();

  // Get port
  const port = process.env.PORT || 3001;

  // Get environment info
  const environment = {
    nodeVersion: process.version,
    nodeEnv: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  };

  logger.info('Diagnostics endpoint called');

  res.json({
    serverStartTime,
    registeredRoutes: routes,
    port,
    recentLogs,
    environment,
  });
});

export default router;