import mongoose from "mongoose";

const canvasSchema = new mongoose.Schema({
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
}, {timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
}})

const Canvas = mongoose.model("Canvas", canvasSchema);
export default Canvas;