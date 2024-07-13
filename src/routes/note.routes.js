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

router.route('/search')
    .get(verifyJWT, searchNotes);

router.route('/')
    .get(verifyJWT, getAllNotes)
    .post(verifyJWT, createNote);

router.route('/:noteId')
    .get(verifyJWT, getCurrentNote)
    .put(verifyJWT, updateNote)
    .delete(verifyJWT, deleteNote);

router.route('/:id/share')
    .post(verifyJWT, shareNote);


export default router;