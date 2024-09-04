const Message = require("../models/message");

exports.getRoomIds = async (req, res) => {
  try {
    // Fetch distinct room IDs
    const roomIds = await Message.distinct("roomId");

    // Fetch the latest message for each room ID to get the createdAt timestamp
    const roomMessages = await Message.find({ roomId: { $in: roomIds } })
      .sort({ createdAt: -1 }) // Sort messages by createdAt in descending order
      .exec();

    // Create a map to get the latest createdAt timestamp for each roomId
    const roomIdToDateMap = {};
    roomMessages.forEach((message) => {
      if (!roomIdToDateMap[message.roomId]) {
        roomIdToDateMap[message.roomId] = message.createdAt;
      }
    });

    // Sort roomIds based on the latest createdAt timestamp
    const sortedRoomIds = roomIds.sort((a, b) => {
      return (roomIdToDateMap[b] || 0) - (roomIdToDateMap[a] || 0);
    });

    res
      .status(200)
      .json({ message: "Get roomIds successfully", roomIds: sortedRoomIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

    // Send the messages as a JSON response
    res.json({
      messages,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    next(error); // Pass the error to the next middleware (e.g., an error handler)
  }
};
