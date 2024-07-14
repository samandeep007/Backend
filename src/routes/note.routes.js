import {Router} from 'express';
import {
    createNote,
    getCurrentNote,
    getAllNotes,
    updateNote,
    deleteNote,
    shareNote
} from '../controllers/notes.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();


// CRUD operations for notes for a specific user 
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