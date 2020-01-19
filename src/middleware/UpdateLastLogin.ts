import express from 'express';
import { UserModel } from '../models';

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('here');
    
    UserModel.updateOne({
        _id: '5e231bf1caa0dd24bcc89f6e'
    }, {
        $set: {
            last_login: new Date()
        }
    },
    () => {},
    );
    next();
}