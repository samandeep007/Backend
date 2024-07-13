import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'; // Import your Express app
import { Note } from '../models/note.model'; // Adjust the path as needed

const { expect } = chai;
chai.use(chaiHttp);

let token;
let noteId;

describe('Note API', () => {
  before(async () => {
    // Authenticate to get the token
    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' });

    token = res.body.token;
  });

  describe('POST /api/notes', () => {
    it('should create a new note', (done) => {
      chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Note', content: 'This is a test note' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('note');
          noteId = res.body.note._id; // Save note ID for further tests
          done();
        });
    });
  });

  describe('GET /api/notes', () => {
    it('should get a list of all notes', (done) => {
      chai.request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /api/notes/:noteId', () => {
    it('should get a note by ID', (done) => {
      chai.request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('note');
          done();
        });
    });
  });

  describe('PUT /api/notes/:noteId', () => {
    it('should update a note by ID', (done) => {
      chai.request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Note Title' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('note');
          done();
        });
    });
  });

  describe('DELETE /api/notes/:noteId', () => {
    it('should delete a note by ID', (done) => {
      chai.request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('POST /api/notes/:noteId/share', () => {
    it('should share a note with another user', (done) => {
      // Assuming you have a valid user ID to share with
      chai.request(app)
        .post(`/api/notes/${noteId}/share`)
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 'anotheruser@example.com' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('GET /api/search?q=:query', () => {
    before(async () => {
      // Create a note to search
      await Note.create({
        title: 'Searchable Note',
        content: 'This note is for search testing',
        userId: 'testuser@example.com', // Use a valid user ID or ref
      });
    });

    it('should search for notes by keywords', (done) => {
      chai.request(app)
        .get('/api/search?q=Searchable Note')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
});
