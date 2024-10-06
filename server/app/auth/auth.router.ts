import express from 'express';
import * as authController from './auth.controller.ts';

const router = express.Router();
router.post('/login', authController.login);
router.post('/signup', authController.signup);

export default router;
