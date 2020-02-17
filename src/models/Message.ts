import mongoose, { Schema, Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

export interface IMessage extends Document {
    text: {
        type: Schema.Types.String;
        require: boolean;
    };
    readed: boolean;
    dialog: {
        type: Schema.Types.ObjectId;
        ref: string;
    };
    user: {
        type: Schema.Types.ObjectId;
        ref: string;
    }
}

const MessageSchema = new Schema({
    text: {
        type: String,
        require: Boolean
    },
    readed: {
        type: Boolean,
        default: false
    },
    dialog: { 
        type: Schema.Types.ObjectId, 
        ref: 'Dialog',
        require: true
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        require: true
    },
    // Вложения к сообщениям
    attachments: [{
        type: Schema.Types.ObjectId, 
        ref: 'UploadFile',
    }]
}, {
    timestamps: true,
    usePushEach: true
});

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;