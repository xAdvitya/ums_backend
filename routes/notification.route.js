import express from 'express';
import { sendNotification } from '../controllers/notification.controller.js';
import { verifyToken } from '../middlewares/token.middleware.js';
const router = express.Router();

router.post('/send', verifyToken, sendNotification);

export default router;
