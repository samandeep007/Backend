import {Router} from 'express';
import {
    createNote,
    getCurrentNote,
    getAllNotes,
    updateNote,
    deleteNote,
    shareNote,
    searchNotes
} from '../controllers/notes.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/')
    .get(verifyJWT, getAllNotes)
    .post(verifyJWT, createNote);

router.route('/:noteId')
    .get(verifyJWT, getCurrentNote)
    .put(verifyJWT, updateNote)
    .delete(verifyJWT, deleteNote);

router.route('/:id/share')
    .post(verifyJWT, shareNote);


router.route('/search')
    .get(verifyJWT, searchNotes);

export default router;