import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

import { UserModel } from './schemas';

import { UserController } from './controllers';

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

app.get('/user/:id', User.index);
app.post('/user/sing-up', User.create);
app.delete('/user/:id', User.delete);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});