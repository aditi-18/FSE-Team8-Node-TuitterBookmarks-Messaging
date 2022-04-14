/**
* @file Implements mongoose schema for message
*/
import mongoose, {Schema} from "mongoose";
import Message from "../models/Message";

/**
* @typedef Follow Represents user following another user,
* @property {string} message Text which needs to be sent
* @property {User} to User to whom messaged is to be sent
* @property {User} from User who is sending a message
* @property {Date} sentOn Date when message is sent
*/

const MessageSchema = new mongoose.Schema<Message>({
  conversationId: String,
  message: String,
  to: {type: Schema.Types.ObjectId, ref: "UserModel"},
  from: {type: Schema.Types.ObjectId, ref: "UserModel"},
  sentOn: {type: Date, default: Date.now}
}, {collection: "messages"});
export default MessageSchema;