// import jwt from 'jsonwebtoken';
// import { models } from './db/index';
// const secret = 'catpack';
// interface User {
//   id: string;
//   role: string;
// }
// /**
//  * takes a user object and creates a jwt out of it
//  * using user.id and user.role
//  * @param {Object} user the user to create a jwt for
//  */
// const createToken = ({ id, role }: User): string => jwt.sign({ id, role }, secret);
// /**
//  * will attempt to verify a jwt and find a user in the
//  * db associated with it. Catches any error and returns
//  * a null user
//  * @param {String} token jwt from client
//  */
// const getUserFromToken = (token: string): Promise<User | null> => {
//   try {
//     const user = jwt.verify(token, secret) as User;
//     return models.User.findOne({ id: user.id });
//   } catch (e) {
//     return Promise.resolve(null);
//   }
// };
// /**
//  * checks if the user is on the context object
//  * continues to the next resolver if true
//  * @param {Function} next next resolver function to run
//  */
// const authenticated = (next: any) => (root: any, args: any, context: any, info: any) => {
//   if (!context.user) {
//     throw new Error('not authorized');
//   }
//   return next(root, args, context, info);
// };
// /**
//  * checks if the user on the context has the specified role.
//  * continues to the next resolver if true
//  * @param {String} role enum role to check for
//  * @param {Function} next next resolver function to run
//  */
// const authorized = (role: string, next: any) => (root: any, args: any, context: any, info: any) => {
//   if (context.user.role !== role) {
//     throw new Error(`Must be a ${role}`);
//   }
//   return next(root, args, context, info);
// };
// export {
//   getUserFromToken,
//   authenticated,
//   authorized,
//   createToken
// };
