import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import {app} from '../../app.js'; // Assuming you export your express app from app.js or index.js
import { User } from '../../models/user.model.js';
import { Note } from '../../models/note.model.js';
import "dotenv/config";


let mongoServer;
let accessToken;
let userId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Ensure mongoose is not already connected
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }

    const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123', fullName: "John Doe" });
    await user.save();
    userId = user._id;

    accessToken = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Notes API', () => {
    it('should create a new note', async () => {
        const response = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Test Note', content: 'This is a test note.', tags: ['test'], archived: false });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('_id');
        expect(response.body.data.title).toBe('Test Note');
    });

    it('should get all notes', async () => {
        const response = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a specific note by ID', async () => {
        const note = await Note.create({ userId, title: 'Test Note', content: 'This is a test note.', tags: ['test'], archived: false });

        const response = await request(app)
            .get(`/api/notes/${note._id}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe('Test Note');
    });

    it('should update a note by ID', async () => {
        const note = await Note.create({ userId, title: 'Update Test Note', content: 'This is a test note to update.', tags: ['test'], archived: false });

        const response = await request(app)
            .put(`/api/notes/${note._id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Updated Note', content: 'Updated content' });

        expect(response.status).toBe(200);
        const updatedNote = await Note.findById(note._id);
        expect(updatedNote.title).toBe('Updated Note');
    });

    it('should delete a note by ID', async () => {
        const note = await Note.create({ userId, title: 'Delete Test Note', content: 'This is a test note to delete.', tags: ['test'], archived: false });

        const response = await request(app)
            .delete(`/api/notes/${note._id}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        const deletedNote = await Note.findById(note._id);
        expect(deletedNote).toBeNull();
    });

     it('should share a note with another user', async () => {
        const note = await Note.create({ userId, title: 'Share Test Note', content: 'This is a test note to share.', tags: ['test'], archived: false });
        const newUser = new User({ username: 'newuser2', email: 'newuser2@example.com', password: 'password123', fullName: "John Doe" });
        await newUser.save();

        const response = await request(app)
            .post(`/api/notes/${note._id}/share`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ userIdToShareWith: newUser._id });

        expect(response.status).toBe(200);

        // Logging to verify values
        console.log('Expected:', newUser._id.toString());
        const sharedNote = await Note.findById(note._id);
        console.log('Received:', sharedNote.shared_with);

        // Use a stricter equality check
        expect(sharedNote.shared_with.map(id => id.toString())).toContain(newUser._id.toString());
    });

    it('should search notes', async () => {
        const response = await request(app)
            .get('/api/search?q=Test')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
    });
});
