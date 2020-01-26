import express from 'express';
import socket from 'socket.io';

import { DialogModel, MessageModel } from '../models';

class DialogController {

    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    index = (req: any, res: express.Response) => {
        const authorId: string = req.user._id;
        DialogModel.find({ author: authorId })
            .populate(['author', 'partner'])
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'user',
                },
            })
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

    create = (req: any, res: express.Response) => {
        const postDataDialog: object = {
            author: req.user._id,
            partner: req.body.partner
        };
        const dialog = new DialogModel(postDataDialog);
        dialog
            .save()
            .then((dialogObj: any) => {
                /** Сохраняем первое сообщение диалога */
                const postDataMessage = {
                    text: req.body.text,
                    dialog: dialogObj._id,
                    user: req.body.author
                };
                const message = new MessageModel(postDataMessage);
                message
                    .save()
                    .then(() => {
                        res.json(dialogObj);
                    })
                    .catch((err) => {
                        res.json(err);
                    })
            })
            .catch((reason) => {
                res.json(reason);
            });
    }

    delete = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id;
        DialogModel.findOneAndRemove({ _id: id })
            .then(() => {
                res.json({
                    message: 'Диалог удален'
                });
            })
            .catch(() => {
                res.json({
                    message: 'Диалог не найден'
                });
            });
    }

}

export default DialogController;