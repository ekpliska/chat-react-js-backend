import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import { 
    UserController, 
    DialogController, 
    MessageController } from './controllers';

import { UpdateLastLogin, checkAuth } from './middlewares';

import { LoginValidation, RegisterValidation } from './util/validations';

const app = express();
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

const User = new UserController();
const Dialog = new DialogController();
const Message = new MessageController();

app.post('/user/sing-up', RegisterValidation, User.create);
app.post('/user/sing-in', LoginValidation, User.singin);
app.get('/user/:id', User.index);
app.delete('/user/:id', User.delete);

app.get('/dialogs', Dialog.index);
app.delete('/dialogs/:id', Dialog.delete);
app.post('/dialogs', Dialog.create);

app.get('/messages', Message.index);
app.post('/messages', Message.create);

app.listen(process.env.PORT, function () {
    console.log(`App listening on port ${ process.env.PORT }!`);
});