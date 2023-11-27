let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "*",
        credentials: true, // 允许发送凭据（例如，cookies
      },
    });
    return io;
  },
  getIO() {
    if (!io) {
      throw new Error("Socket.io is not initialized!");
    }
    return io;
  },
};
