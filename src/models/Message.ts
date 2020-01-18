import mongoose, { Schema, Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

export interface IMessage extends Document {
    text: string;
    unread: boolean;
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
        required: 'Укажите текст сообщения',
    },
    unread: {
        type: Boolean,
        default: false
    },
    dialog: { 
        type: Schema.Types.ObjectId, 
        ref: 'Dialog',
        required: 'Не передан ID диалога',
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: 'Не передан ID пользователя',
    }
}, {
    timestamps: true
});

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;