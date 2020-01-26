import mongoose, { Schema, Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

import { generatePasswordHash } from '../util';

export interface IUser extends Document {
    email: string;
    photo?: string;
    fullname: string;
    password: string;
    confirmed: boolean;
    confirmed_hash?: string;
    last_login?: Date;
}

const UserSchema = new Schema({
    email: {
        type: String,
        required: 'Email является обязательным',
        validate: [isEmail, 'Не верно указан email'],
        index: { unique: true }
    },
    photo: String,
    fullname: {
        type: String,
        required: 'Имя пользователя является обязательным'
    },
    password: {
        type: String,
        required: 'Пароль является обязательным'
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmed_hash: String,
    last_login: {
        type: Date,
        default: new Date(),
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next: any) {
    const user: any = this;

    if (!user.isModified('password')) {
        return next();
    }

    user.password = await generatePasswordHash(user.password);
    user.confirmed_hash = await generatePasswordHash(new Date().toString());

});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;