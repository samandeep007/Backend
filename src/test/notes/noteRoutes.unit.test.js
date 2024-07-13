import request from 'supertest';
import express from 'express';
import notesRouter from '../../routes/notes.routes'; // Adjust path as necessary
import { Note } from '../../models/note.model.js'; // Adjust path as necessary
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/notes', notesRouter);

jest.mock('../../models/note.model.js'); // Mock Note model
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn()
}));

describe('Notes Routes Unit Tests', () => {
    const mockToken = 'mock-token';

    beforeEach(() => {
        jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
            if (token === mockToken) {
                callback(null, { userId: 'mock-user-id' });
            } else {
                callback(new Error('Invalid token'));
            }
        });
    });

    it('GET /api/notes - should return all notes for the user', async () => {
        const notesData = [{ title: 'Note 1', content: 'Content 1', userId: 'mock-user-id' }];
        Note.find = jest.fn().mockResolvedValue(notesData);

        const response = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].title).toBe('Note 1');
    });

    it('GET /api/notes/:noteId - should return a note by ID', async () => {
        const noteData = { title: 'Note 1', content: 'Content 1', userId: 'mock-user-id' };
        Note.findById = jest.fn().mockResolvedValue(noteData);

        const response = await request(app)
            .get('/api/notes/1')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Note 1');
    });

    it('POST /api/notes - should create a new note', async () => {
        const noteData = { title: 'New Note', content: 'New content', userId: 'mock-user-id' };
        Note.create = jest.fn().mockResolvedValue(noteData);

        const response = await request(app)
            .post('/api/notes')
            .send(noteData)
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('New Note');
    });

    it('PUT /api/notes/:noteId - should update a note', async () => {
        const noteData = { title: 'Updated Note', content: 'Updated content', userId: 'mock-user-id' };
        Note.findByIdAndUpdate = jest.fn().mockResolvedValue(noteData);

        const response = await request(app)
            .put('/api/notes/1')
            .send(noteData)
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Note');
    });

    it('DELETE /api/notes/:noteId - should delete a note', async () => {
        Note.findByIdAndDelete = jest.fn().mockResolvedValue({ message: 'Note deleted successfully' });

        const response = await request(app)
            .delete('/api/notes/1')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Note deleted successfully');
    });
});
