import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

import { UserController, DialogController } from './controllers';

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

app.get('/user/:id', User.index);
app.post('/user/sing-up', User.create);
app.delete('/user/:id', User.delete);

app.get('/dialogs/:id', Dialog.index);
app.post('/dialogs', Dialog.create);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});