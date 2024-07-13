import express from 'express';
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


router.route('/api/notes')
    .get(verifyJWT, getAllNotes)
    .post(verifyJWT, createNote);

router.route('/api/notes/:noteId')
    .get(verifyJWT, getCurrentNote)
    .put(verifyJWT, updateNote)
    .delete(verifyJWT, deleteNote);

router.route('/api/notes/:id/share')
    .post(verifyJWT, shareNote);


router.route('/api/search')
    .get(verifyJWT, searchNotes);

export default router;