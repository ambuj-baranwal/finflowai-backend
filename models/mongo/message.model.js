import mongoose from "mongoose";
// import chatSessionModel from "./chatSession.model";


const messageSchema = new mongoose.Schema({
    chatSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSession",
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DOcument',
        default: null,
    },
    canvasNodeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CanvasNode',
        default: null,
    },
}, {timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
}})


export default Message = mongoose.model("Message", messageSchema)