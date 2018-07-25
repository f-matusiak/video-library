const socketIO = require('socket.io');

const configSocket = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {

    socket.on('addVideo', (video) => {
      socket.broadcast.emit('newVideo', video);
    });
  });

  return io;
};

module.exports = configSocket;