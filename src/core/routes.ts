import express from 'express';
import socket from 'socket.io';
import bodyParser from 'body-parser';

import { UpdateLastLogin, checkAuth } from '../middlewares';

import { 
    UserController, 
    DialogController, 
    MessageController } from '../controllers';

import { LoginValidation, RegisterValidation } from '../util/validations';

const appRoutes = (app: express.Express, io: socket.EngineSocket) => {

    // Для того чтобы работать в json данными
    app.use(bodyParser.json());
    app.use(UpdateLastLogin);
    app.use(checkAuth);

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
};

export default appRoutes;