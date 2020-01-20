import express from 'express';
import { verifyJWTToken } from '../util';
import { IUser } from '../models/User';

export default (req: any, res: any, next: any) => {

    if (req.path === '/user/singin' || req.path === '/user/sing-up') {
        return next();
    }

    const token = req.headers.token;

    verifyJWTToken(token)
        .then((user: any) => {
            req.user = user.data._doc;
            next();
        })
        .catch(err => {
            res.status(403).json({
                message: 'Invalid auth token provided'
            });
        });
}