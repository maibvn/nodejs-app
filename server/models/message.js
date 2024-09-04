const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true }, // The text of the message
  from: { type: String, required: true }, // The sender of the message
  roomId: { type: String, required: true }, // The chat room ID the message belongs to
  createdAt: { type: Date, default: Date.now }, // Timestamp when the message was created
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
