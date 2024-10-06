import express from 'express';
import { authToken } from '../middleware/authToken.ts';
import * as eventController from './event.controller.ts';
// /api/events/
const router = express.Router();

router.use(authToken);
router.get('/', eventController.get_active_events);
router.get('/user/:userId', eventController.get_events_for_user);
router.get('/:event_id', eventController.get_event_by_id);
router.post('/create', eventController.create_event);
router.put('/edit/:event_id', eventController.edit_event);
export default router;
