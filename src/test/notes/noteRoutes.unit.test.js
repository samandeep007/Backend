import request from 'supertest';
import express from 'express';
import notesRouter from '../../routes/notes.routes'; // Adjust path as necessary
import { Note } from '../../models/note.model.js'; // Adjust path as necessary
import jwt from 'jsonwebtoken';
import { expect } from 'chai'; // Chai for assertions
import sinon from 'sinon'; // Sinon for stubbing

const app = express();
app.use(express.json());
app.use('/api/notes', notesRouter);

describe('Notes Routes Unit Tests', () => {
    const mockToken = 'mock-token';
    let verifyStub;

    beforeEach(() => {
        // Stub jwt.verify to simulate token verification
        verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            if (token === mockToken) {
                callback(null, { userId: 'mock-user-id' });
            } else {
                callback(new Error('Invalid token'));
            }
        });
    });

    afterEach(() => {
        // Restore the original function
        sinon.restore();
    });

    it('GET /api/notes - should return all notes for the user', async () => {
        const notesData = [{ title: 'Note 1', content: 'Content 1', userId: 'mock-user-id' }];
        sinon.stub(Note, 'find').resolves(notesData);

        const response = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).to.equal(200);
        expect(response.body.length).to.be.greaterThan(0);
        expect(response.body[0].title).to.equal('Note 1');
    });

    it('GET /api/notes/:noteId - should return a note by ID', async () => {
        const noteData = { title: 'Note 1', content: 'Content 1', userId: 'mock-user-id' };
        sinon.stub(Note, 'findById').resolves(noteData);

        const response = await request(app)
            .get('/api/notes/1')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal('Note 1');
    });

    it('POST /api/notes - should create a new note', async () => {
        const noteData = { title: 'New Note', content: 'New content', userId: 'mock-user-id' };
        sinon.stub(Note, 'create').resolves(noteData);

        const response = await request(app)
            .post('/api/notes')
            .send(noteData)
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('New Note');
    });

    it('PUT /api/notes/:noteId - should update a note', async () => {
        const noteData = { title: 'Updated Note', content: 'Updated content', userId: 'mock-user-id' };
        sinon.stub(Note, 'findByIdAndUpdate').resolves(noteData);

        const response = await request(app)
            .put('/api/notes/1')
            .send(noteData)
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal('Updated Note');
    });

    it('DELETE /api/notes/:noteId - should delete a note', async () => {
        sinon.stub(Note, 'findByIdAndDelete').resolves({ message: 'Note deleted successfully' });

        const response = await request(app)
            .delete('/api/notes/1')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Note deleted successfully');
    });
});
