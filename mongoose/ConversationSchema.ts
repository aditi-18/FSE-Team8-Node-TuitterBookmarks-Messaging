import mongoose, {Schema} from "mongoose";

const ConversationSchema = new mongoose.Schema({
  members: {
    type: Array,
  },
},

{collection: "conversation"});
export default ConversationSchema;