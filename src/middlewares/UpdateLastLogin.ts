import express from 'express';
import { UserModel } from '../models';

declare module 'express' {
    export interface Request {
        user?: any;
    }
}

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.user) {
        UserModel.findOneAndUpdate(
            { _id: req.user.id },
            {
                last_login: new Date()
            },
            { new: true },
            () => { }
        );
    }
    next();
};