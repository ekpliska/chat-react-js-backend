import express from 'express';
import socket from 'socket.io';
import bodyParser from 'body-parser';

import { UpdateLastLogin, checkAuth } from '../middlewares';

import { 
    UserController, 
    DialogController, 
    MessageController } from '../controllers';

import { LoginValidation, RegisterValidation } from '../util/validations';

const appRoutes = (app: express.Express, io: socket.Server) => {

    // В каждый контроллер передаем сокет io
    const UserCntrl = new UserController(io);
    const DialogCntrl = new DialogController(io);
    const MessageCntrl = new MessageController(io);

    // Для того чтобы работать в json данными
    app.use(bodyParser.json());
    app.use(checkAuth);
    app.use(UpdateLastLogin);

    app.post('/user/sing-up', RegisterValidation, UserCntrl.create);
    app.get('/user/verify', UserCntrl.verify);
    app.post('/user/sing-in', LoginValidation, UserCntrl.singin);
    app.get('/user/profile', UserCntrl.getMe);
    app.get('/user/search', UserCntrl.search);
    app.get('/user/:id', UserCntrl.show);
    app.delete('/user/:id', UserCntrl.delete);
    
    app.get('/dialogs', DialogCntrl.index);
    app.delete('/dialogs/:id', DialogCntrl.delete);
    app.post('/dialogs', DialogCntrl.create);
    
    app.get('/messages', MessageCntrl.index);
    app.post('/messages', MessageCntrl.create);
    app.delete('/messages/:id', MessageCntrl.delete);
};

export default appRoutes;