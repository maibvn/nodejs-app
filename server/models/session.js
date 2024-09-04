const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    expires: "2h", // Automatically remove session after 2 hours
    default: Date.now,
  },
});

module.exports = mongoose.model("Session", sessionSchema);
