import express from 'express';
import * as userController from './user.controller.ts';
import { authToken } from '../middleware/authToken.ts';
const router = express.Router();

// This applies token checking to everything on this router
router.use(authToken);
router.post('/update/:userId', userController.updateUser);

export default router;
