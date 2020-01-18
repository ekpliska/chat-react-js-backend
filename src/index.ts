import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

import { 
    UserController, 
    DialogController, 
    MessageController } from './controllers';

const app = express();

// Для того чтобы работать в json данными
app.use(bodyParser.json());

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

app.get('/user/:id', User.index);
app.post('/user/sing-up', User.create);
app.delete('/user/:id', User.delete);

app.get('/dialogs', Dialog.index);
app.delete('/dialogs/:id', Dialog.delete);
app.post('/dialogs', Dialog.create);

app.get('/messages', Message.index);
app.post('/messages', Message.create);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});