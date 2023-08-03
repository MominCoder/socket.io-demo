// running socket.io server which is an instance of http, io.on is an instance of socket.io server.

const io = require("socket.io")(5000, {
  cors: true, // enable to allow cross origin requests
});

const users = {};

// io.on will listen to all socket connections

io.on("connection", (socket) => {
  // socket.on will handle particular socket events

  socket.on("new-user-join", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send-message", (data, room) => {
    // io.emit("broadcast-receive" , data);             // this will broadcast message to all users incluidng sender

    if (!room) {
      socket.broadcast.emit("broadcast-receive", {
        message: data,
        name: users[socket.id],
      }); // this will broadcast message to all users excluidng sender
    } else {
      socket
        .to(room)
        .emit("broadcast-receive", { message: data, name: users[socket.id] });
    }
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`Joined ${room} room ----------------`);
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left-chat", users[socket.id]);
    delete users[socket.id];
  });

  // socket.on("ping", console.log("status"));
});
