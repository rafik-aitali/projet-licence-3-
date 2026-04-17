const { Server } = require("socket.io");

let io;
const connectedUsers = new Map();

const initializeSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      socket.on("registerUser", (userId) => {
        connectedUsers.set(userId, socket.id);
      });

      socket.on("disconnect", () => {
        let disconnectedUserId = null;
        connectedUsers.forEach((value, key) => {
          if (value === socket.id) {
            disconnectedUserId = key;
            connectedUsers.delete(key);
          }
        });
      });
    });
  }
  return io;
};
const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized!");
  }
  return io;
};
module.exports = { initializeSocket, getIo, connectedUsers };
