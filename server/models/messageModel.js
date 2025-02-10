import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create the model from the schema
const Message = mongoose.model("Message", messageModel);

export default Message;
