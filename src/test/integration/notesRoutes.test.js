import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app.js';
import { Note } from '../../models/note.model.js';
import { User } from '../../models/user.model.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Notes API Integration Tests', () => {
    let authToken;

    before(async () => {
        authToken = await getValidAuthToken(); // Implement or mock a method to get a valid auth token
    });

    after(async () => {
        await Note.deleteMany({}); // Clean up the database after tests
    });

    describe('POST /api/notes', () => {
        it('should create a new note', (done) => {
            chai.request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Note',
                    content: 'This is a test note.',
                    tags: ['test'],
                    archived: false
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('status', 200);
                    expect(res.body).to.have.property('data');
                    expect(res.body.data).to.include({
                        title: 'Test Note',
                        content: 'This is a test note.',
                        tags: ['test'],
                        archived: false
                    });
                    done();
                });
        });
    });

    describe('GET /api/notes/:noteId', () => {
        it('should retrieve a note by ID', (done) => {
            const note = new Note({
                userId: 'user1',
                title: 'Test Note',
                content: 'This is a test note.'
            });
            note.save().then(savedNote => {
                chai.request(app)
                    .get(`/api/notes/${savedNote._id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('status', 200);
                        expect(res.body).to.have.property('data');
                        expect(res.body.data).to.include({
                            title: 'Test Note',
                            content: 'This is a test note.'
                        });
                        done();
                    });
            });
        });
    });

    describe('GET /api/notes', () => {
        it('should retrieve all notes for the user', (done) => {
            const notes = [
                { userId: 'user1', title: 'Note 1', content: 'Content 1' },
                { userId: 'user1', title: 'Note 2', content: 'Content 2' }
            ];
            Note.insertMany(notes).then(() => {
                chai.request(app)
                    .get('/api/notes')
                    .set('Authorization', `Bearer ${authToken}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('status', 200);
                        expect(res.body).to.have.property('data').with.lengthOf(2);
                        done();
                    });
            });
        });
    });

    describe('PUT /api/notes/:noteId', () => {
        it('should update a note by ID', (done) => {
            const note = new Note({
                userId: 'user1',
                title: 'Test Note',
                content: 'This is a test note.'
            });
            note.save().then(savedNote => {
                chai.request(app)
                    .put(`/api/notes/${savedNote._id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        title: 'Updated Note',
                        content: 'This is an updated test note.'
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('status', 200);
                        expect(res.body).to.have.property('message', 'note updated successfully');
                        done();
                    });
            });
        });
    });

    describe('DELETE /api/notes/:noteId', () => {
        it('should delete a note by ID', (done) => {
            const note = new Note({
                userId: 'user1',
                title: 'Test Note',
                content: 'This is a test note.'
            });
            note.save().then(savedNote => {
                chai.request(app)
                    .delete(`/api/notes/${savedNote._id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('status', 200);
                        expect(res.body).to.have.property('message', 'Note deleted successfully');
                        done();
                    });
            });
        });
    });

    describe('POST /api/notes/:id/share', () => {
        it('should share a note with another user', (done) => {
            const note = new Note({
                userId: 'user1',
                title: 'Test Note',
                content: 'This is a test note.'
            });
            note.save().then(savedNote => {
                const user = new User({
                    _id: 'user2',
                    username: 'testuser2'
                });
                user.save().then(() => {
                    chai.request(app)
                        .post(`/api/notes/${savedNote._id}/share`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .send({ userIdToShareWith: 'user2' })
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body).to.have.property('status', 200);
                            expect(res.body).to.have.property('message', 'Note shared successfully');
                            done();
                        });
                });
            });
        });
    });

    describe('GET /api/notes/search', () => {
        it('should search notes based on query', (done) => {
            const notes = [
                { userId: 'user1', title: 'Test Note', content: 'This is a test note.', tags: ['test'] },
                { userId: 'user1', title: 'Another Note', content: 'This is another note.', tags: ['another'] }
            ];
            Note.insertMany(notes).then(() => {
                chai.request(app)
                    .get('/api/notes/search')
                    .set('Authorization', `Bearer ${authToken}`)
                    .query({ q: 'test' })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('status', 200);
                        expect(res.body).to.have.property('data').with.lengthOf(1);
                        done();
                    });
            });
        });
    });
});
