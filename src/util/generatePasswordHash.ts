// import jwt from 'jsonwebtoken';
// import { reduce } from 'lodash';
// import { IUser } from '../models/User';

// export default (user: IUser) => {
//     let token = jwt.sign(
//         {
//             data: reduce(user, (result: object, value: string, key: string) => {
//                 if (key !== 'password') {
//                     result[key] = value;
//                 }
//                 return result;
//             }, {})
//         },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: process.env.
//         }
//     );
// }
