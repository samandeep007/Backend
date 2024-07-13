import mongoose, {Schema} from 'mongoose';

const noteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: [true, "Please provide a title for the note"],
        trim: true,
    },

    content: {
        type: String,
        required: true
    },

    tags: [String],

    archived: {
        type: Boolean,
        default: false
    },

}, {timestamps: true});

noteSchema.index({ title: 'text' }); // Full-text search on title
noteSchema.index({ tags: 1 }); // Index for efficient tag-based searches

export const Note = mongoose.model('Note', noteSchema);