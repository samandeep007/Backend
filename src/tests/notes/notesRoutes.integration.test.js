import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import notesRouter from '../../routes/note.routes.js'; 
import { Note } from '../../models/notes.model.js';
import { User } from '../../models/user.model.js'; 
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/notes', notesRouter);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Notes API Integration Tests', () => {
    let user;
    let token;

    beforeEach(async () => {
        user = new User({ username: 'testuser', password: 'testpassword' });
        await user.save();

        token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

        // Create a sample note for testing
        const note = new Note({
            userId: user._id,
            title: 'Existing Note',
            content: 'Content of the existing note',
        });
        await note.save();
    });

    it('GET /api/notes - should return all notes for the user', async () => {
        const response = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].title).toBe('Existing Note');
    });

    it('GET /api/notes/:noteId - should return a note by ID', async () => {
        const note = await Note.findOne();
        
        const response = await request(app)
            .get(`/api/notes/${note._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Existing Note');
    });

    it('POST /api/notes - should create a new note', async () => {
        const newNote = { title: 'New Note', content: 'New content', userId: user._id };

        const response = await request(app)
            .post('/api/notes')
            .send(newNote)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('New Note');
    });

    it('PUT /api/notes/:noteId - should update a note', async () => {
        const note = await Note.findOne();
        const updatedNote = { title: 'Updated Note', content: 'Updated content' };

        const response = await request(app)
            .put(`/api/notes/${note._id}`)
            .send(updatedNote)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Note');
    });

    it('DELETE /api/notes/:noteId - should delete a note', async () => {
        const note = await Note.findOne();

        const response = await request(app)
            .delete(`/api/notes/${note._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Note deleted successfully');
    });
});
