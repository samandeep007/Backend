import { Router } from 'express';
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the note
 *         userId:
 *           type: string
 *           description: The id of the user who owns the note
 *         title:
 *           type: string
 *           description: The title of the note
 *         content:
 *           type: string
 *           description: The content of the note
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: The tags associated with the note
 *         archived:
 *           type: boolean
 *           description: Whether the note is archived
 *         shared_with:
 *           type: array
 *           items:
 *             type: string
 *           description: The ids of users with whom the note is shared
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the note was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the note was last updated
 *       example:
 *         id: d5fE_asz
 *         userId: 5f8f8f8f8f8f8f8f8f8f8f8
 *         title: Note Title
 *         content: Note content
 *         tags: ["tag1", "tag2"]
 *         archived: false
 *         shared_with: ["5f8f8f8f8f8f8f8f8f8f8f8"]
 */

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: The notes managing API
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Returns the list of all the notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: The note was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.route('/')
    .get(verifyJWT, getAllNotes)
    .post(verifyJWT, createNote);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   get:
 *     summary: Get the note by id
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     responses:
 *       200:
 *         description: The note description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The note was not found
 *   put:
 *     summary: Update the note by the id
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: The note was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The note was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Remove the note by id
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     responses:
 *       200:
 *         description: The note was deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The note was not found
 */
router.route('/:noteId')
    .get(verifyJWT, getCurrentNote)
    .put(verifyJWT, updateNote)
    .delete(verifyJWT, deleteNote);

/**
 * @swagger
 * /api/notes/{id}/share:
 *   post:
 *     summary: Share the note by id
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIdToShareWith:
 *                 type: string
 *                 description: The id of the user to share the note with
 *     responses:
 *       200:
 *         description: The note was shared
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The note or user was not found
 *       400:
 *         description: Note is already shared with this user
 */
router.route('/:id/share')
    .post(verifyJWT, shareNote);

export default router;
