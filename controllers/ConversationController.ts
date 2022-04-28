import {Express, Request, Response} from "express";
import ConversationDao from "../daos/ConversationDao";
import ConversationControllerI from "../interfaces/ConversationController";
import Conversation from "../models/Conversation";

export default class ConversationController implements ConversationControllerI {
    private static conversationDao: ConversationDao = ConversationDao.getInstance();
     private static conversationController: ConversationController | null = null;

    public static getInstance = (app: Express): ConversationController => {
        if(ConversationController.conversationController === null) {
            ConversationController.conversationController = new ConversationController();
            app.get("/api/users/findConversation/:uid1/:uid2", ConversationController.conversationController.findConversationOfBothUsers);
            app.get("/api/users/conversation/:uid1", ConversationController.conversationController.findConversationOfUser);
            app.post("/api/users/conversation", ConversationController.conversationController.createConversation);
            app.delete("/api/users/deleteconversation/:cid", ConversationController.conversationController.deleteConversation);
        }
        return ConversationController.conversationController;
    }

    private constructor() {}


createConversation = (req: Request, res: Response) =>
ConversationController.conversationDao.createConversation(req.body.uid1, req.body.uid2)
.then((conversation: Conversation) => res.json(conversation));

findConversationOfBothUsers = (req: Request, res: Response) =>
ConversationController.conversationDao.findConversationOfBothUsers(req.params.uid1, req.params.uid2)
.then((conversation: Conversation[]) => res.json(conversation));

findConversationOfUser = (req: Request, res: Response) =>
ConversationController.conversationDao.findConversationOfUser(req.params.uid1)
.then((conversation: Conversation[]) => res.json(conversation));

deleteConversation = (req: Request, res: Response) =>
          ConversationController.conversationDao.deleteConversation(req.params.cid)
              .then((status) => res.send(status));

}