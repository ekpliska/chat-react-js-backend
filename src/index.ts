import mongoose from 'mongoose';
import express from 'express';

import User from './schemas/User';

const app = express();

// mongodb://localhost:27017/<db_name>
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true });

app.get('/create', function (req: any, res: any) {
    const user = new User({ email: 'test@example.com', fullname: 'Test User' });
    user.save().then((obj: any) => {
        res.json(obj)
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});