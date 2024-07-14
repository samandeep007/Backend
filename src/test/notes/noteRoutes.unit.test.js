import { createNote, getCurrentNote, getAllNotes, updateNote, deleteNote, shareNote, searchNotes } from '../../controllers/notes.controller.js';
import { User } from '../../models/user.model.js';
import { Note } from '../../models/note.model.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../../utils/apiError.js';
import { ApiResponse } from '../../utils/apiResponse.js';

jest.mock('../../models/user.model.js');
jest.mock('../../models/note.model.js');
jest.mock('jsonwebtoken');
jest.mock('../../utils/apiError.js');
jest.mock('../../utils/apiResponse.js');

describe('Notes Controller', () => {
    let req, res, next, user, note, accessToken;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {}, user: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();

        user = { _id: 'user123', username: 'testuser', email: 'test@example.com', password: 'password123', fullName: 'John Doe' };
        note = { _id: 'note123', userId: user._id, title: 'Test Note', content: 'This is a test note.', tags: ['test'], archived: false, shared_with: [], save: jest.fn() };

        accessToken = 'fakeAccessToken';
        jwt.sign.mockReturnValue(accessToken);
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { _id: user._id });
        });

        User.findById.mockResolvedValue(user);
        Note.create.mockResolvedValue(note);
        Note.findById.mockResolvedValue(note);
        Note.find.mockResolvedValue([note]);
        Note.findByIdAndUpdate.mockResolvedValue(note);
        Note.findByIdAndDelete.mockResolvedValue(note);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new note', async () => {
        req.body = { title: 'Test Note', content: 'This is a test note.', tags: ['test'], archived: false };
        req.user.id = user._id;

        await createNote(req, res, next);

        expect(Note.create).toHaveBeenCalledWith({ ...req.body, userId: user._id });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, note, "Note created successfully"));
    });

    it('should handle missing title or content during note creation', async () => {
        req.body = { title: '', content: 'This is a test note.' };
        req.user.id = user._id;

        try {
            await createNote(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.status).toBe(400);
            expect(error.message).toBe("Required fields are missing");
        }
    });

    it('should get all notes', async () => {
        req.user.id = user._id;

        await getAllNotes(req, res, next);

        expect(Note.find).toHaveBeenCalledWith({ userId: user._id });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [note], "Notes retrieved successfully"));
    });

    it('should handle no notes found', async () => {
        Note.find.mockResolvedValue([]);

        req.user.id = user._id;

        await getAllNotes(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new ApiResponse(404, [], "Notes not found"));
    });

    it('should get a specific note by ID', async () => {
        req.params.noteId = note._id;
        req.user.id = user._id;

        await getCurrentNote(req, res, next);

        expect(Note.findOne).toHaveBeenCalledWith({ _id: note._id, userId: user._id });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, note, "Note retrieved successfully"));
    });

    it('should handle missing note ID', async () => {
        req.user.id = user._id;

        try {
            await getCurrentNote(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.status).toBe(400);
            expect(error.message).toBe("Note ID is required");
        }
    });

    it('should handle note not found', async () => {
        Note.findOne.mockResolvedValue(null);
        req.params.noteId = note._id;
        req.user.id = user._id;

        try {
            await getCurrentNote(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.status).toBe(404);
            expect(error.message).toBe("Note not found");
        }
    });

    it('should update a note by ID', async () => {
        req.params.noteId = note._id;
        req.body = { title: 'Updated Note', content: 'Updated content' };
        req.user.id = user._id;

        await updateNote(req, res, next);

        expect(Note.findById).toHaveBeenCalledWith(note._id);
        expect(note.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [], "Note updated successfully"));
    });

    it('should handle note not found during update', async () => {
        Note.findById.mockResolvedValue(null);
        req.params.noteId = note._id;
        req.user.id = user._id;

        try {
            await updateNote(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.status).toBe(404);
            expect(error.message).toBe("Note not found");
        }
    });

    it('should delete a note by ID', async () => {
        req.params.noteId = note._id;
        req.user.id = user._id;

        await deleteNote(req, res, next);

        expect(Note.findByIdAndDelete).toHaveBeenCalledWith(note._id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [], "Note deleted successfully"));
    });

    it('should handle note not found during delete', async () => {
        Note.findByIdAndDelete.mockResolvedValue(null);
        req.params.noteId = note._id;
        req.user.id = user._id;

        try {
            await deleteNote(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.status).toBe(404);
            expect(error.message).toBe("Note not found");
        }
    });

    it('should share a note with another user', async () => {
        const newUser = { _id: 'user456', username: 'newuser', email: 'newuser@example.com', password: 'password123', fullName: 'Jane Doe' };
        User.findById.mockResolvedValueOnce(newUser);

        req.params.id = note._id;
        req.body.userIdToShareWith = newUser._id;
        req.user.id = user._id;

        await shareNote(req, res, next);

        expect(Note.findById).toHaveBeenCalledWith(note._id);
        expect(User.findById).toHaveBeenCalledWith(newUser._id);
        expect(note.shared_with).toContain(newUser._id.toString());
        expect(note.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [], "Note shared successfully"));
    });

    it('should handle note already shared', async () => {
        note.shared_with.push('user456');
        req.params.id = note._id;
        req.body.userIdToShareWith = 'user456';
        req.user.id = user._id;
    
        await shareNote(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new ApiResponse(400, [], "Note is already shared with this user"));
    });

    it('should handle note not found during share', async () => {
        Note.findById.mockResolvedValue(null);
        req.params.id = note._id;
        req.body.userIdToShareWith = 'user456';
        req.user.id = user._id;

        try {
            await shareNote(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.status).toBe(404);
            expect(error.message).toBe("Note not found");
        }
    });

    it('should handle user not found during share', async () => {
        Note.findById.mockResolvedValue(note);
        User.findById.mockResolvedValue(null);
        req.params.id = note._id;
        req.body.userIdToShareWith = 'user456';
        req.user.id = user._id;

        try {
            await shareNote(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.status).toBe(404);
            expect(error.message).toBe("User not found");
        }
    });

    it('should search notes', async () => {
        req.query.q = 'Test';
        req.user.id = user._id;

        await searchNotes(req, res, next);

        expect(Note.find).toHaveBeenCalledWith({
            $or: [
                { title: new RegExp('Test', 'i') },
                { content: new RegExp('Test', 'i') },
                { tags: { $in: [new RegExp('Test', 'i')] } }
            ],
            userId: user._id
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [note], "Search results"));
    });

    it('should handle missing query parameter during search', async () => {
        req.query.q = '';
        req.user.id = user._id;

        try {
            await searchNotes(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.status).toBe(400);
            expect(error.message).toBe("Query parameter is required");
        }
    });

    it('should handle search errors', async () => {
        Note.find.mockRejectedValue(new Error("Search failed"));
        req.query.q = 'Test';
        req.user.id = user._id;

        try {
            await searchNotes(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.status).toBe(500);
            expect(error.message).toBe("Something went wrong while searching for notes");
        }
    });
});
