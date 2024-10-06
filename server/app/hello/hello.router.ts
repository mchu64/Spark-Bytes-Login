import express from 'express';
import * as helloController from './hello.controller.ts';
const router = express.Router();

router.get('/hello', helloController.helloWorld);

export default router;
