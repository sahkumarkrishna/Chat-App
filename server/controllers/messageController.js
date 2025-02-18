import mongoose from "mongoose";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js"; // Import Message model
import { getReceiverSocketId, io } from "../socket/socket.js";

// Send message function
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    let receiverId = req.params.id.trim();

    // Validate ObjectIds
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

    // Find or create conversation
    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // Create new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      conversationId: gotConversation._id,
    });

    // Add message to conversation
    gotConversation.messages.push(newMessage._id);
    await gotConversation.save();

    // Emit message to receiver using socket
    const receiverSocketId = await getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // Send message in real-time to the receiver
    }

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get messages
export const getMessage = async (req, res) => {
  try {
    const receiverId = req.params.id.trim();
    const senderId = req.user.userId;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid sender or receiver ID" });
    }

    // Find conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages",
      select: "senderId receiverId message createdAt", // Select only required fields
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    return res.status(200).json({
      message: "Conversation retrieved successfully",
      data: conversation.messages,
    });
  } catch (error) {
    console.error("Error in getMessage:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
