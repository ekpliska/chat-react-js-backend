import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';

import './core/db';
import appRoutes from './core/routes';
import createSocket from './core/socket';

const app = express();
// Отдельный сервер на http
const http = createServer(app);
// Отдельный сервер на socket.io
const io = createSocket(http);

dotenv.config();

appRoutes(app, io);

// io.on('connection', function (socket: any) {
//    console.log('a user connected');
// });

http.listen(process.env.PORT, function () {
    console.log(`App listening on port ${ process.env.PORT }!`);
});