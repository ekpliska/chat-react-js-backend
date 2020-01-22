import express from 'express';
import { createServer } from 'http';
import socket from 'socket.io';
import dotenv from 'dotenv';

import './core/db';
import appRoutes from './core/routes';

const app = express();
// Отдельный сервер на http
const http = createServer(app);
// Отдельный сервер на socket.io
const io = socket(http);
dotenv.config();

appRoutes(app, io);

io.on('connection', function (socket: any) {
   console.log('a user connected');
});

http.listen(process.env.PORT, function () {
    console.log(`App listening on port ${ process.env.PORT }!`);
});