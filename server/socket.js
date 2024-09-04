const { Server } = require("socket.io");
const Message = require("./models/message");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  // Fetch unique room IDs and set up real-time updates
  // So when new user send a mess, auto update UI
  const handleMessageUpdates = async ({ roomId, from }) => {
    // const { roomId, from } = data;
    try {
      if (from === "client") {
        // Retrieve unique room IDs from the Message collection
        const roomIds = await Message.distinct("roomId");

        // Emit the new message if its roomId is in the list of room IDs
        if (!roomIds.includes(roomId)) {
          io.emit("messageUpdate", roomId);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Initialize the real-time updates handling
  io.on("connection", (socket) => {
    // Store client information
    socket.on("register", (data) => {
      const { roomId } = data;
      handleMessageUpdates(data);
      socket.join(roomId); // Join the client to a room
    });

    socket.on("send_message", async (data) => {
      // Save message to database
      const { roomId, message, from } = data;

      try {
        // Save message to database
        await Message.create({ roomId, message, from });

        // Emit the message to clients in the room
        io.to(roomId).emit("receive_message", data);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      // No need to manually delete clients, as socket.io handles room management
    });
  });
}

module.exports = setupSocket;
