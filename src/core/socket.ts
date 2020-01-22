import socket from 'socket.io';
import http from 'http';

export default (http: http.Server) => {

    const io = socket(http);

    io.on('connection', function (socket: socket.Socket) {
        console.log('a user connected');
     });

    return io;
}