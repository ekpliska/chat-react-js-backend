import express from 'express';
import socket from 'socket.io';

import { MessageModel, DialogModel } from '../models';

class MessageController {

    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    index = (req: express.Request, res: express.Response) => {
        const dialogId: string = req.query.dialog;
        MessageModel.find({ dialog: dialogId })
            .populate(['dialog', 'user'])
            .exec((err, dialogs) => {
                if (err) {
                    return res.status(404)
                        .json({
                            message: 'Диалог не найден'
                        });
                }
                return res.json(dialogs);
        })
    };

    create = (req: express.Request, res: express.Response) => {
        const postData = {
            text: req.body.text,
            dialog: req.body.dialog_id,
            user: 'req.user._id'
        };
        const message = new MessageModel(postData);
        message
            .save()
            .then((obj: any) => {
                obj.populate('dialog', (err: any, message: any) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }

                    DialogModel.findByIdAndUpdate(
                        { _id: postData.dialog }, 
                        { lastMessage: message._id },
                        { upsert: true }, (err: any) => {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }

                            res.json(message);
                            this.io.emit('SERVER:NEW_MESSAGE', message);

                        })
                })
            })
            .catch((reason) => {
                res.json(reason);
            });
    }

    delete = (req: express.Request, res: express.Response) => {
        const id:string = req.params.id;
        MessageModel.findOneAndDelete({ _id: id })
            .then((message: any) => {
                if (message) {
                    res.json({
                        message: 'Сообщение удалено'
                    });
                }
            })
            .catch(() => {
                res.json({
                    message: 'Сообщение не найдено'
                });
            });
    }

}

export default MessageController;