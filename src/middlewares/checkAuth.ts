import express from 'express';
import { verifyJWTToken } from '../util';
import { IUser } from '../models/User';

export default (req: any, res: any, next: any) => {

    if (req.path === '/user/sing-in' || req.path === '/user/sing-up' || req.path === '/user/verify') {
        return next();
    }

    const token = req.headers.token;

    verifyJWTToken(token)
        .then((user: any) => {
            // Для авторизированного пользователя его информация из User будет доступна в req.user
            req.user = user.data._doc;
            next();
        })
        .catch(err => {
            res.status(403).json({
                message: 'Invalid auth token provided'
            });
        });
}