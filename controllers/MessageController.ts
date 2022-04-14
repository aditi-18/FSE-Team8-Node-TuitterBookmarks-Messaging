/**
 * @file Controller RESTful Web service API for message resource
 */
 import MessageDao from "../daos/MessageDao";
 import Message from "../models/Message";
 import {Express, Request, Response} from "express";
 import MessageControllerI from "../interfaces/MessageController";
 
  /**
   * @class MessageController Implements RESTful Web service API for message resource.
   * Defines the following HTTP endpoints:
   * <ul>
   *     <li>POST /api/users/:uid1/message/:uid2 to create a new message instance</li>
   *     <li>GET /api/users/:uid/incomingmessages to retrieve a list of messages sent to them </li>
   *     <li>GET /api/users/:uid/outgoingmessages to retrieve a list of messages they have sent </li>
   *     <li>DELETE /api/user/:uid1/deletemessage/:uid2 to remove a particular message instance</li>
   * </ul>
   * @property {MessageDao} messageDao Singleton DAO implementing message CRUD operations
   * @property {MessageController} messageController Singleton controller implementing
   * RESTful Web service API
   */
  export default class MessageController implements MessageControllerI {
      private static messageDao: MessageDao = MessageDao.getInstance();
      private static messageController: MessageController | null = null;
  
      /**
       * Creates singleton controller instance
       * @param {Express} app Express instance to declare the RESTful Web service
       * API
       * @return MessageController
       */
      public static getInstance = (app: Express): MessageController => {
          if(MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
              app.get("/api/users/:uid/outgoingmessages", MessageController.messageController.outgoingMessages);
              app.get("/api/users/:uid/incomingmessages", MessageController.messageController.incomingMessages);
              app.post("/api/users/:uid1/message", MessageController.messageController.userMessagesAnotherUser);
              app.delete("/api/user/:uid1/deletemessage/:uid2", MessageController.messageController.userDeletesAMessage);
              app.get("/api/users/findMessages/:conversationId", MessageController.messageController.findMessage);
          }
          return MessageController.messageController;
      }
  
      private constructor() {}
  
      
      /**
       * Retrieves retrieve a list of messages they have sent
       * @param {Request} req Represents request from client
       * @param {Response} res Represents response to client, including the
       * body formatted as JSON arrays containing the message objects
       */
       outgoingMessages = (req: Request, res: Response) =>
         MessageController.messageDao.outgoingMessages(req.params.uid)
              .then((message: Message[]) => res.json(message));
  
      /**
       * Retrieves retrieve a list of messages sent to them
       * @param {Request} req Represents request from client
       * @param {Response} res Represents response to client, including the
       * body formatted as JSON arrays containing the message objects
       */
       incomingMessages = (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid1 === 'my' && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid1;
            MessageController.messageDao.incomingMessages(userId)
            .then((message: Message[]) => res.json(message));
    }
        
  
      /**
       * Creates a new message instance
       * @param {Request} req Represents request from client, including body
       * containing the JSON object for the new message to be inserted in the
       * database
       * @param {Response} res Represents response to client, including the
       * body formatted as JSON containing the new message that was inserted in the
       * database
       */
       userMessagesAnotherUser = (req: Request, res: Response) => {
            // @ts-ignore
            let userId = req.params.uid1 === 'my' && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid1;
            console.log(userId);
         MessageController.messageDao.userMessagesAnotherUser(userId,req.body)
              .then((message: Message) => res.json(message));
       }
  
      /**
       * Removes a message instance from the database
       * @param {Request} req Represents request from client, including path
       * parameter tid identifying the primary key of the message to be deleted
       * @param {Response} res Represents response to client, including status
       * on whether deleting a user was successful or not
       */
       userDeletesAMessage = (req: Request, res: Response) =>
         MessageController.messageDao.userDeletesAMessage(req.params.uid1,req.params.uid2)
              .then((status) => res.send(status));

        findMessage = (req: Request, res: Response) =>
              MessageController.messageDao.findMessage(req.params.conversationId)
                   .then((message: Message[]) => res.json(message));
        
  };
 
 