import Conversation from "../models/Conversation";
import ConversationModel from "../mongoose/ConversationModel";
import ConversationDaoI from "../interfaces/ConversationDao" 

export default class ConversationDao implements ConversationDaoI{

    private static conversationDao: ConversationDao | null = null;
     public static getInstance = (): ConversationDao => {
         if(ConversationDao.conversationDao === null) {
            ConversationDao.conversationDao = new ConversationDao();
         }
         return ConversationDao.conversationDao;
     }
     private constructor() {}

createConversation = async (uid1:string,uid2:string) : Promise<Conversation> => {
   return ConversationModel.create({ members: [uid1, uid2] });
};

findConversationOfUser = async (uid1:string) : Promise<Conversation[]> => {
    return ConversationModel.find({members:{$in:[uid1]}});
  };

findConversationOfBothUsers = async (uid1:string,uid2:string) : Promise<Conversation[]> => {
    return ConversationModel.find({members:{$all:[uid1,uid2]}})
  
}};

