import express from 'express';

import { UserModel } from '../models';
import { IUser } from '../models/User';

import { createJWTToken } from '../util';

class UserController {

    auth(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password
        };

        console.log(req.body);
        

        UserModel.findOne({ email: postData.email }, (err, user: IUser) => {
            if (err || !user) {
                return res.status(404).json({
                    message: 'Пользователь не найден'
                });
            }

            if (user.password === postData.password) {
                const token = createJWTToken(postData);
        
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

    index(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        UserModel.findById(id, (err, user) => {
            if (err) {
                return res.status(404)
                    .json({
                        message: 'Пользователь не найден'
                    });
            }
            return res.json(user);
        })
    };

    create(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password
        };
        const user = new UserModel(postData);
        user
            .save()
            .then((obj: any) => {
                res.json(obj)
            })
            .catch((reason) => {
                res.json(reason)
            });
    };

    delete(req: express.Request, res: express.Response) {
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