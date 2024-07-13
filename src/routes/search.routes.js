import { Router } from 'express';
import { searchNotes } from '../controllers/notes.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/')
    .get(verifyJWT, searchNotes);

export default router;