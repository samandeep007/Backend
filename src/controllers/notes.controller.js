import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Note } from '../models/note.model.js';
import {User} from '../models/user.model.js';

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
        const notes = await Note.find({ userId: req.user.id }); 

        if (!notes.length) {
            return res.status(404).json(new ApiResponse(
                404,
                [],
                "Notes not found"
            ));
        }

        return res.status(200).json(new ApiResponse(
            200,
            notes,
            "Notes retrieved successfully"
        ));

    } catch (error) {
        throw new ApiError(
            error.status || 500,
            error.message || "Something went wrong while retrieving notes"
        );
    }
});

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const {title, content, tags, archived, shared_with} = req.body;
    const updateDetails = {
        title: title,
        content: content,
        tags: tags,
        archived: archived,
        shared_with: shared_with
    };

    const validUpdates = Object.fromEntries(
        Object.entries(updateDetails).filter(([key, value]) => value !== undefined && value !== "")
    );
    

    try {

        const note = await Note.findById(noteId);

        if (!note) {
            throw new ApiError(404, "Note not found");
        }

        Object.assign(note, validUpdates);

        await note.save({ validateBeforeSave: false });

        return res.
            status(200)
            .json(
                new ApiResponse(
                    200,
                    [],
                    "note updated successfully"
                )
            )

    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Something went wrong while updating the note"
        );

    }
})


const deleteNote = asyncHandler(async(req, res) => {
    const {noteId} = req.params;
    try {
      const note =  await Note.findByIdAndDelete(noteId)

      if(!note){
        throw new ApiError(404, "Note not found");
      }

      return res
      .status(200)
      .json(new ApiResponse(
        200,
        [],
        "Note deleted successfully"
      ));

    } catch (error) {
        throw new ApiError(
            error.status || 500,
            error.message || "Something went wrong while deleting the note"
        )
    }
})


const shareNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userIdToShareWith } = req.body;

    try {
  
        const note = await Note.findById(id);

        if (!note) {
            throw new ApiError(404, "Note not found");
        }


        const user = await User.findById(userIdToShareWith);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

 
        if (note.shared_with.includes(userIdToShareWith)) {
            return res.status(400).json(
                new ApiResponse(
                    400,
                    [],
                    "Note is already shared with this user"
                )
            );
        }


        note.shared_with.push(userIdToShareWith);


        await note.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "Note shared successfully"
            )
        );
    } catch (error) {
        throw new ApiError(
            error.status || 500,
            error.message || "Something went wrong while sharing the note"
        );
    }
});


const searchNotes = asyncHandler(async (req, res) => {
    const { query } = req.query; 

    if (!query) {
        throw new ApiError(400, "Query parameter is required");
    }

    try {
        const searchRegex = new RegExp(query, 'i');

        const notes = await Note.find({
            $and: [
                { $or: [
                    { title: searchRegex },
                    { content: searchRegex },
                    { tags: searchRegex }
                ]}
            ]
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                notes,
                "Search results"
            )
        );
    } catch (error) {
        throw new ApiError(
            error.status || 500,
            error.message || "Something went wrong while searching for notes"
        );
    }
});

