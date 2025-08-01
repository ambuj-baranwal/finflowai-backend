
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      return this.auth_provider === 'email';
    },
    select: false, // Don't include password in queries by default
  },
  auth_provider: {
    type: String,
    required: true,
    enum: ['google', 'github', 'email'],
  },
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);
export default User;

