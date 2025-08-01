
import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
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
},
  { timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  } } 
);

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;
