import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import chatRouter from './routers/chatRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors()); // Allow cross-origin requests from front-end
app.use(express.json()); // Parse incoming JSON requests
app.use(logger); // Custom request logging

// API Routers
app.use('/api/chat', chatRouter);

// Serve static files from the React frontend app
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Anything that doesn't match the API routes should be served the React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
