import {Server} from 'socket.io';

const SocketHandler = (req, res) => {
    if (res.socket.server.io) {
        return res.end();
    }

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
        socket.on("join", (roomName) => {
            const {rooms} = io.sockets.adapter;
            const room = rooms.get(roomName);
            if (room === undefined) {
                socket.join(roomName);
                socket.emit("created");
            } else if (room.size === 1) {
                socket.join(roomName);
                socket.emit("joined");
            } else {
                socket.emit("full");
            }
        });

        socket.on("ready", (roomName) => {
            socket.broadcast.to(roomName).emit("ready");
        });

        socket.on("ice-candidate", (candidate, roomName) => {
            socket.broadcast.to(roomName).emit("ice-candidate", candidate);
        });

        socket.on("offer", (offer, roomName) => {
            socket.broadcast.to(roomName).emit("offer", offer);
        });

        socket.on("answer", (answer, roomName) => {
            socket.broadcast.to(roomName).emit("answer", answer);
        });

        socket.on("leave", (roomName) => {
            socket.leave(roomName);
            socket.broadcast.to(roomName).emit("leave");
        });
    });
    return res.end();
};

export default SocketHandler;
