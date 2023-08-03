const io =  require("socket.io")(5000, {
    cors: true // enable to allow cross origin requests
});

io.on("connection", socket => {
    socket.on("send-message", (data, room) => {
        // io.emit("broadcast" , data);             // this will broadcast message to all users incluidng sender

        if (!room) {
            socket.broadcast.emit("broadcast" , data);  // this will broadcast message to all users excluidng sender
        }else{
            socket.to(room).emit("broadcast", data);
        };
    });

    socket.on("join-room", (room, cb) => {
        socket.join(room);
        cb(`Joined ${room} room ----------------`)
    });

    // socket.on("ping", console.log("status"));
})