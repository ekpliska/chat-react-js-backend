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
            user: req.user._id
        };
        const message = new MessageModel(postData);
        message
            .save()
            .then((obj: any) => {
                obj.populate(['dialog', 'user'], (err: any, message: any) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }

                    DialogModel.findByIdAndUpdate(
                        { _id: postData.dialog },
                        { lastMessage: message._id },
                        { upsert: true },
                        function (err: any) {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }
                        }
                    );

                    res.json(message);
                    this.io.emit('SERVER:MESSAGES_CREATED', message);

                });
            })
            .catch((reason) => {
                res.json(reason);
            });
    }

    delete = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id;
        const authorid: string = req.user._id;

        MessageModel.findById(id, (err, message: any) => {
            if (err || !message) {
                return res.status(404).json({
                    success: false,
                    message: 'Сообщение не найдено'
                });
            }

            if (message.user.toString() !== authorid) {
                return res.status(403).json({
                    success: false,
                    message: 'Вы не являетесь автором сообщения'
                });
            }

            const dialogId = message.dialog;

            message.remove();

            MessageModel.findOne(
                { dialog: dialogId },
                {},
                { sort: { 'created_at': -1 } },
                (err, lastMessage) => {
                    console.log('lastMessage', lastMessage);
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }

                    DialogModel.findById(dialogId, (err, dialog: any) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err
                            });
                        }

                        dialog.lastMessage = lastMessage;
                        dialog.save();
                    });

                });

            return res.json({
                success: true,
                message: 'Сообщение успешно удалено'
            });

        });
    }

}

export default MessageController;