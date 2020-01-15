import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

const UserSchema = new Schema({
    email: {
        type: String,
        required: 'Email является обязательным',
        validate: [isEmail, 'Не верно указан email']
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
    last_login: Date
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

export default User;