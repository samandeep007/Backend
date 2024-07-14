import { Router } from 'express';
import { searchNotes } from '../controllers/notes.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search notes
 *     description: Search for notes based on a query parameter. Requires a valid JWT token for authentication. The query parameter `q` is required.
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query to filter notes by title, content, or tags.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notes matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The note ID.
 *                       title:
 *                         type: string
 *                         description: The title of the note.
 *                       content:
 *                         type: string
 *                         description: The content of the note.
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: The tags associated with the note.
 *                 message:
 *                   type: string
 *                   example: "Search results"
 *       400:
 *         description: Bad Request. Query parameter `q` is required.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       500:
 *         description: Internal server error. Something went wrong while searching for notes.
 */

router.route('/api/search')
    .get(verifyJWT, searchNotes);

export default router;
