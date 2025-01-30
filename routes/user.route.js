import express from 'express';
import { updateProfile, getProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/token.middleware.js';

const router = express.Router();

router.get('/:userId', getProfile);
router.put('/update', verifyToken, updateProfile);

export default router;
