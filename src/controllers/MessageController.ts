import express from 'express';

import { MessageModel } from '../models';

class MessageController {

    index(req: express.Request, res: express.Response) {
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

    create(req: express.Request, res: express.Response) {
        const postData:object = {
            text: req.body.text,
            dialog: req.body.dialog_id,
            user: 'req.user._id'
        };
        const message = new MessageModel(postData);
        message
            .save()
            .then((obj: any) => {
                res.json(obj);
            })
            .catch((reason) => {
                res.json(reason);
            });
    }

    delete(req: express.Request, res: express.Response) {
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