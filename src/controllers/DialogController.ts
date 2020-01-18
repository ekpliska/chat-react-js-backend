import express from 'express';

import { DialogModel, MessageModel } from '../models';

class DialogController {

    index(req: express.Request, res: express.Response) {
        const authorId: string = '5e231bf1caa0dd24bcc89f6e';
        DialogModel.find({ author: authorId })
            .populate(['author', 'partner'])
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
        const postDataDialog: object = {
            author: req.body.author,
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

    delete(req: express.Request, res: express.Response) {
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