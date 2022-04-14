import {Request, Response} from "express";

export default interface ConversationController {
    createConversation (req: Request, res: Response): void;
    findConversationOfUser (req: Request, res: Response): void;
    findConversationOfBothUsers (req: Request, res: Response): void;
};