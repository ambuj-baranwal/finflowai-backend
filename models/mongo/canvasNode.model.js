import mongoose from "mongoose";

const canvasNodeSchema = new mongoose.Schema({
    canvasId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Canvas",
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'code', 'reference'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    // position is required to decide where canvas is opened
    position: {
        x: {type: Number, required: true},
        y: {type: Number, required: true},
    },
    linkedMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    linkedDocumentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DOcument",
        default: null,
    },
    
}, {timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
}})

export default CanvasNode = mongoose.model("CanvasNode", canvasNodeSchema)