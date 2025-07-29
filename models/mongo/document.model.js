import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },
    fileType: {
        type: String,
        required: true,
        enum: ['pdf', 'docx', 'xlsx', 'txt'],
    },
    cloudReferenceUrl: {
        type: String,
        required: true,
    },
    parserMetadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },


}, { timestamps: true });

const Document = mongoose.model("Document", DocumentSchema);
export default Document;