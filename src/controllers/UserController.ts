import express from 'express';
import socket from 'socket.io';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import { UserModel } from '../models';
import { IUser } from '../models/User';

import { createJWTToken } from '../util';

class UserController {

    io: socket.Server;
    constructor(io: socket.Server) {
        this.io = io;
    }

    singin = (req: express.Request, res: express.Response) => {
        const postData = {
            email: req.body.email,
            password: req.body.password
        };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        UserModel.findOne({ email: postData.email }, (err, user: IUser) => {
            if (err || !user) {
                return res.status(404).json({
                    message: 'Пользователь не найден'
                });
            }
            
            if (bcrypt.compareSync(postData.password, user.password)) {
                const token = createJWTToken(user);
        
                res.json({
                    success: true,
                    token: token
                });

            } else {
                res.json({
                    success: false,
                    message: 'Неверный логин или пароль'
                });
            }

        });


    }

    getMe = (req: any, res: express.Response) => {
        const userId = req.user._id;
        UserModel.findById(userId, (err, user) => {
            if (err || !user) {
                return res.status(404)
                    .json({
                        message: 'Пользователь не найден'
                    });
            }
            return res.json(user);
        })
    }

    show = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id;
        UserModel.findById(id, (err, user) => {
            if (err) {
                return res.status(404)
                    .json({
                        message: 'Пользователь не найден'
                    });
            }
            return res.json(user);
        });
    };

    create = (req: express.Request, res: express.Response) => {
        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password
        };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        const user = new UserModel(postData);
        user
            .save()
            .then((obj: any) => {
                res.json({
                    success: true,
                    message: obj
                });
            })
            .catch((reason) => {
                res.status(500).json({
                    success: false,
                    message: reason
                })
            });
    };

    // sinp-up/verify?hash=<string>
    verify = (req: express.Request, res: express.Response) => {
        const hash = req.query.hash;

        if (!hash) {
            return res.status(422).json({
                errors: 'Invalid hash'
            });
        }

        UserModel.findOne({ confirmed_hash: hash }, (err, user) => {
            if (err || !user) {
                return res.status(404).json({
                    success: false,
                    errors: 'Hash not found'
                });
            }

            user.confirmed = true;
            user
                .save(err => {
                    if (err) {
                        return res.status(404).json({
                            success: false,
                            errors: err
                        });
                    }
                    res.json({
                        success: true,
                        message: 'Ваш аккаун успешно подтвержден'
                    });
                })
        })
    }

    delete = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id;
        UserModel.findOneAndDelete({ _id: id })
            .then((user) => {
                if (user) {
                    res.json({
                        message: `Пользователь ${user.fullname} удален`
                    });
                }
            })
            .catch(() => {
                res.json({
                    message: 'Пользователь не найден'
                });
            });
    }

}

export default UserController;