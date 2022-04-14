/**
 * @file Implements mongoose model to CRUD
 * documents in the conversation collection
 */
 import mongoose from "mongoose";
 import ConversationSchema from "./ConversationSchema";
 const ConversationModel = mongoose.model('ConversationModel', ConversationSchema);
 export default ConversationModel;
