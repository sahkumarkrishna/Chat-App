import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Ensure this is in the schema
  },
  { timestamps: true }
);

// Create the model from the schema
const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
