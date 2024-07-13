import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import notesRouter from '../../routes/note.routes.js'; // Adjust path as necessary
import { Note } from '../../models/note.model.js'; // Adjust path as necessary
import { User } from '../../models/user.model.js'; // Adjust path as necessary
import { MongoMemoryServer } from 'mongodb-memory-server';
import { expect } from 'chai'; // Chai for assertions

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/notes', notesRouter);

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Notes API Integration Tests', () => {
    let user;

    beforeEach(async () => {
        user = new User({ username: 'testuser', password: 'testpassword', fullName: 'john doe', email: 'john@example.com' });
        await user.save();
    });

    it('POST /api/notes - should create a new note', async () => {
        const noteData = { title: 'New Note', content: 'New content', userId: user._id };

        const response = await request(app)
            .post('/api/notes')
            .send(noteData)
            .set('Authorization', `Bearer ${user._id}`); // Mock JWT token

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(noteData.title);
    });

    it('PUT /api/notes/:noteId - should update a note', async () => {
        const note = new Note({
            userId: user._id,
            title: 'Old Title',
            content: 'Old Content',
        });
        await note.save();

        const updatedNote = { title: 'Updated Title', content: 'Updated Content' };

        const response = await request(app)
            .put(`/api/notes/${note._id}`)
            .send(updatedNote)
            .set('Authorization', `Bearer ${user._id}`); // Mock JWT token

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(updatedNote.title);
    });

    it('DELETE /api/notes/:noteId - should delete a note', async () => {
        const note = new Note({
            userId: user._id,
            title: 'Note to delete',
            content: 'Content',
        });
        await note.save();

        const response = await request(app)
            .delete(`/api/notes/${note._id}`)
            .set('Authorization', `Bearer ${user._id}`); // Mock JWT token

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Note deleted successfully');
    });
});
