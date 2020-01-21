import mongoose from 'mongoose';
import express from 'express';
import { createServer } from 'http';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import { 
    UserController, 
    DialogController, 
    MessageController } from './controllers';

import { UpdateLastLogin, checkAuth } from './middlewares';

import { LoginValidation, RegisterValidation } from './util/validations';

const app = express();
// Отдельный сервер на http
const http = createServer(app);
// Отдельный сервер на socket.io
const io = socket(http);
dotenv.config();

// Для того чтобы работать в json данными
app.use(bodyParser.json());
app.use(UpdateLastLogin);
app.use(checkAuth);

// mongodb://localhost:27017/<db_name>
mongoose.connect('mongodb://localhost:27017/chat', {
    useNewUrlParser: true, 
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.post('/user/sing-up', RegisterValidation, UserController.create);
app.post('/user/sing-in', LoginValidation, UserController.singin);
app.get('/user/profile', UserController.getMe);
app.get('/user/:id', UserController.show);
app.delete('/user/:id', UserController.delete);

app.get('/dialogs', DialogController.index);
app.delete('/dialogs/:id', DialogController.delete);
app.post('/dialogs', DialogController.create);

app.get('/messages', MessageController.index);
app.post('/messages', MessageController.create);

io.on('connection', function (socket: any) {
   console.log('a user connected');
});

http.listen(process.env.PORT, function () {
    console.log(`App listening on port ${ process.env.PORT }!`);
});