import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js"; // Import Message model

// Send message function
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    let receiverId = req.params.id.trim();

    // Validate if senderId and receiverId are valid ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid sender or receiver ID" });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // Find existing conversation between sender and receiver
    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      // If no conversation exists, create a new one
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // Create a new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      conversationId: gotConversation._id,
    });

    // Add the new message to the conversation
    gotConversation.messages.push(newMessage._id);
    await gotConversation.save();
    // socket io

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const receiverId = req.params.id.trim();
    const senderId = req.user.userId;

    // Validate ObjectIds to make sure they are in proper format
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid sender or receiver ID" });
    }

    // Find the conversation between sender and receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    // If conversation is not found, return an error response
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Return the conversation with populated messages
    return res.status(200).json({
      message: "Conversation retrieved successfully",
      data: conversation.messages, // Fix: Return the messages array
    });
  } catch (error) {
    console.error("Error in getMessage:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
