import express from 'express';
import socket from 'socket.io';

import { UploadFileModel } from '../models';

class UploadController {

    io: socket.Server;
    constructor(io: socket.Server) {
        this.io = io;
    }

    create = (req: express.Request, res: express.Response) => {
        const userId: string = req.user._id;
        const file: any = req.file;
        const fileData = {
            filename: file.original_filename,
            size: file.bytes,
            url: file.url,
            ext: file.format,
            user: userId,
        };
        const image = {};
        const uploadedFile = new UploadFileModel(fileData);

        uploadedFile
            .save()
            .then((fileObj: any) => {
                res.json({
                    success: true,
                    file: fileObj
                })
            })
            .catch((err: any) => {
                res.json({
                    success: false,
                    message: err,
                });
            });
    }

}

export default UploadController;