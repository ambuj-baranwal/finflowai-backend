import mongoose from "mongoose";


const embeddingSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    chunkIndex: {
        type: Number,
        required: true,
    },
    vector: {
        type: [Number],     // Float32Array
        required: true,
    },
    chunkText: {
        type: String,
        required: true,
    },
}, {timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
}})

export default Embedding = mongoose.model("Embedding", embeddingSchema)