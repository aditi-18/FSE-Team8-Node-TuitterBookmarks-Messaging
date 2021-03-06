/**
 * @file Controller RESTful Web service API for dislikes resource
 */
 import {Express, Request, Response} from "express";
import DislikeDao from "../daos/DislikeDao";
import DislikeControllerI from "../interfaces/DislikeController";
import TuitDao from "../daos/TuitDao";
import LikeDao from "../daos/LikeDao";

 

 /**
  * @class DislikeController Implements RESTful Web service API for dislikes resource.
  * Defines the following HTTP endpoints:
  * <ul>
  *     <li>POST /api/users/:uid/likes/:tid to record that a user dislikes a tuit
  *     </li>
  *     <li>GET /api/users/:uid/dislikes/:tid to record that a user
  *     toggles dislikes a tuit</li>
  * </ul>
  * @property {DislikeDao} dislikeDao Singleton DAO implementing dislikes CRUD operations
  * @property {DislikeController} DislikeController Singleton controller implementing
  * RESTful Web service API
  */



 export default class DislikeController implements DislikeControllerI {
     private static dislikeDao: DislikeDao = DislikeDao.getInstance();
     private static tuitDao: TuitDao = TuitDao.getInstance();
     private static likeDao: LikeDao = LikeDao.getInstance();
     private static dislikeController: DislikeController | null = null;
     /**
      * Creates singleton controller instance
      * @param {Express} app Express instance to declare the RESTful Web service
      * API
      * @return LikeController
      */
     public static getInstance = (app: Express): DislikeController => {
         if(DislikeController.dislikeController === null) {
            DislikeController.dislikeController = new DislikeController();
             app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
             app.put("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userTogglesTuitDislikes);
         }
         return DislikeController.dislikeController;
     }
 
   
     private constructor() {}
 
     
     /**
      * Find if user already disliked a tuit
      * @param {Request} req Represents request from client, including the path
      * parameter uid representing the user liked the tuits
      * @param {Response} res Represents response to client, including the
      * body formatted as JSON arrays containing the tuit objects that were liked
      */

      findAllTuitsDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;

        DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
        .then(dislikes => {
            const dislikesNonNullTuits = dislikes.filter(dislike => dislike.tuit);
            const tuitsFromDislikes = dislikesNonNullTuits.map(dislike => dislike.tuit);
            res.json(tuitsFromDislikes);

        });
    }
    

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */

     userTogglesTuitDislikes = async (req: Request, res: Response) => {
        const dislikeDao = DislikeController.dislikeDao;
        const tuitDao = DislikeController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyDislikedTuit = await dislikeDao.findUserDislikedTuit(userId, tid);
            const howManyDislikedTuit = await dislikeDao.countHowManyDislikedTuit(tid);
            const userAlreadyLikedTuit = await DislikeController.likeDao.findUserLikesTuit(userId, tid);
            const howManyLikedTuit = await DislikeController.likeDao.countHowManyLikedTuit(tid);
            let tuit = await tuitDao.findTuitById(tid);
            if (userAlreadyDislikedTuit) {
                await dislikeDao.userRemoveDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDislikedTuit - 1;
            } else {
                await DislikeController.dislikeDao.userDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDislikedTuit + 1;
            }
            if (userAlreadyLikedTuit) {
                await DislikeController.likeDao.userUnlikesTuit(userId,tid);
                tuit.stats.likes = howManyLikedTuit - 1;
            }
            await DislikeController.tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }
 };

