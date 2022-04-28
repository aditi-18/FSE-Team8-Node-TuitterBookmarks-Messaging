import {Request, Response} from "express";

/**
 * @file Declares interface for Message Controller.
 */

export default interface MessageController {
   incomingMessages(req: Request, res: Response): void;
   outgoingMessages(req: Request, res: Response): void;
   userMessagesAnotherUser(req: Request,res: Response): void;
   userDeletesAMessage(req: Request, es: Response): void;
   findMessage(req: Request, es: Response): void;
}