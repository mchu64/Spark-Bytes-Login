import express from 'express';
import { authToken } from '../middleware/authToken.ts';
import * as tagController from './tags.controller.ts';

const router = express.Router();

router.use(authToken);

router.get('/', tagController.get_tags);
router.post('/create', tagController.create_tag);
router.post('/type/create', tagController.tag_type_create);
router.get('/type', tagController.get_tag_types_by_name);
router.get('/type/all', tagController.get_all_tag_types);
export default router;
