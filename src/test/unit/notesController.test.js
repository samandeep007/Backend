import { expect } from 'chai';
import sinon from 'sinon';
import { Note } from '../../models/note.model.js';
import { User } from '../../models/user.model.js';
import { createNote, getCurrentNote, getAllNotes, updateNote, deleteNote, shareNote, searchNotes } from '../../controllers/notes.controller.js';
import { ApiError } from '../../utils/apiError.js';
import { ApiResponse } from '../../utils/apiResponse.js';

describe('Note Controller Unit Tests', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('createNote', () => {
        it('should create a new note', async () => {
            const req = {
                user: { id: 'user1' },
                body: {
                    title: 'Test Note',
                    content: 'This is a test note.',
                    tags: ['test'],
                    archived: false
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sinon.stub(Note, 'create').resolves(req.body);

            await createNote(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                status: 200,
                data: sinon.match.object,
                message: 'Note created successfully'
            }))).to.be.true;
        });
    });

    describe('getCurrentNote', () => {
        it('should retrieve the note by ID', async () => {
            const req = {
                params: { noteId: 'note1' },
                user: { id: 'user1' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sinon.stub(Note, 'findOne').resolves({
                _id: 'note1',
                userId: 'user1',
                title: 'Test Note',
                content: 'This is a test note.'
            });

            await getCurrentNote(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                status: 200,
                data: sinon.match.object,
                message: 'Note retrieved successfully'
            }))).to.be.true;
        });
    });

    describe('getAllNotes', () => {
        it('should retrieve all notes for the user', async () => {
            const req = { user: { id: 'user1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sinon.stub(Note, 'find').resolves([{ title: 'Note 1' }, { title: 'Note 2' }]);

            await getAllNotes(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                status: 200,
                data: sinon.match.array,
                message: 'Notes retrieved successfully'
            }))).to.be.true;
        });
    });

    describe('updateNote', () => {
        it('should update a note by ID', async () => {
            const req = {
                params: { noteId: 'note1' },
                body: {
                    title: 'Updated Note',
                    content: 'This is an updated test note.',
                    tags: ['updated'],
                    archived: false
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const note = {
                _id: 'note1',
                userId: 'user1',
                title: 'Test Note',
                content: 'This is a test note.',
                tags: ['test'],
                archived: false,
                save: sinon.stub().resolvesThis()
            };
            sinon.stub(Note, 'findById').resolves(note);

            await updateNote(req, res);

            expect(note.title).to.equal('Updated Note');
            expect(note.content).to.equal('This is an updated test note.');
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                status: 200,
                message: 'note updated successfully'
            }))).to.be.true;
        });
    });

    describe('deleteNote', () => {
        it('should delete a note by ID', async () => {
            const req = {
                params: { noteId: 'note1' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sinon.stub(Note, 'findByIdAndDelete').resolves({
                _id: 'note1',
                userId: 'user1',
                title: 'Test Note',
                content: 'This is a test note.'
            });

            await deleteNote(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                status: 200,
                message: 'Note deleted successfully'
            }))).to.be.true;
        });
    });

    describe('shareNote', () => {
        it('should share a note with another user', async () => {
            const req = {
                params: { id: 'note1' },
                body: { userIdToShareWith: 'user2' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const note = {
                _id: 'note1',
                userId: 'user1',
                title: 'Test Note',
                content: 'This is a test note.',
                shared_with: [],
                save: sinon.stub().resolvesThis()
            };
            sinon.stub(Note, 'findById').resolves(note);
            sinon.stub(User, 'findById').resolves({
                _id: 'user2',
                username: 'testuser2'
            });

            await shareNote(req, res);

            expect(note.shared_with).to.include('user2');
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                status: 200,
                message: 'Note shared successfully'
            }))).to.be.true;
        });
    });

    describe('searchNotes', () => {
        it('should search notes based on query', async () => {
            const req = {
                query: { q: 'test' },
                user: { id: 'user1' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sinon.stub(Note, 'find').resolves([
                { title: 'Test Note', content: 'This is a test note.', tags: ['test'] }
            ]);

            await searchNotes(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                status: 200,
                data: sinon.match.array,
                message: 'Search results'
            }))).to.be.true;
        });
    });
});
