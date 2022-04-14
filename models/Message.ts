/**
 * @file Declares Message data type representing relationship between
 * two users, as in user messaged other user
 */
 import User from "./User";

 /**
  * @typedef Follow Represents user following another user,
  * @property {string} message Text which needs to be sent
  * @property {User} to User to whom messaged is to be sent
  * @property {User} from User who is sending a message
  * @property {Date} sentOn Date when message is sent
  */
 
 export default interface Message {
    conversationId: string,
    message: string
    to: User,
    from: User,
    sentOn: Date,
 };
