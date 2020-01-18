import express from 'express';

import { DialogModel } from '../models';

class DialogController {

    index(req: express.Request, res: express.Response) {
        const authoId: string = req.params.id;
        DialogModel.find({ author: authoId })
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
        const postData = {
            author: req.body.author,
            partner: req.body.partner,
        };
        const dialog = new DialogModel(postData);
        dialog
            .save()
            .then((obj: any) => {
                res.json(obj);
            })
            .catch((reason) => {
                res.json(reason);
            });
    }

}

export default DialogController;