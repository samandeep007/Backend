import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Note } from '../models/note.model.js'

//CRUD
const createNote = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { title, content, tags, archived } = req.body;
    if (!title || !content) {
        throw new ApiError(400, "Required fields are missing");
    }
    try {
        const note = await Note.create({
            userId: userId,
            title: title,
            content: content,
            tags: tags,
            archived: archived
        })
    
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                note,
                "Note created successfully"
            ))

    } catch (error) {
        throw new ApiError(
            error.status || 400,
            error.message || "Something went wrong while creating the note"
        )
    }
})


const getCurrentNote = asyncHandler(async (req, res) => {

    const { noteId } = req.params;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    // Fetch the note from the database
    const note = await Note.findOne({
        _id: noteId,
        userId: req.user.id 
    }); 

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json({
        status: 200,
        data: note,
        message: "Note retrieved successfully"
    });
});


const getAllNotes = asyncHandler(async (req, res) => {
    try {
        // Fetch all notes for the currently authenticated user
        const notes = await Note.find({ userId: req.user.id }); // Exclude sensitive fields if applicable

        if (!notes.length) {
            // If no notes found, return a message indicating so
            return res.status(404).json({
                status: 404,
                data: [],
                message: "No notes found"
            });
        }

        // Respond with the list of notes
        return res.status(200).json({
            status: 200,
            data: notes,
            message: "Notes retrieved successfully"
        });
    } catch (error) {
        // Handle unexpected errors
        throw new ApiError(
            error.status || 500,
            error.message || "Something went wrong while retrieving notes"
        );
    }
});
