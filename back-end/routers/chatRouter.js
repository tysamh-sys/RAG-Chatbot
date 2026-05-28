import { Router } from 'express';
import { askQuestion, getStatus, getSectionData } from '../controllers/chatController.js';

const router = Router();

// GET /api/chat/status - Check if backend is running
router.get('/status', getStatus);

// POST /api/chat/ask - Submit a user question
router.post('/ask', askQuestion);

// GET /api/chat/section/:sectionName - Fetch section content
router.get('/section/:sectionName', getSectionData);

export default router;
