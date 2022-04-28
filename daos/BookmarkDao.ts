/**
 * @file Implements DAO managing data storage of bookamrks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */

 import BookmarkDaoI from "../interfaces/BookmarkDao";
 import BookmarkModel from "../mongoose/BookmarkModel";
 import Bookmark from "../models/Bookmark";

 /**
   * @class BookmarkDao Implements Data Access Object managing data storage
   * of Bookmarks
   * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
   */

 export default class BookmarkDao implements BookmarkDaoI {
     private static bookmarkDao: BookmarkDao | null = null;
     public static getInstance = (): BookmarkDao => {
         if(BookmarkDao.bookmarkDao === null) {
             BookmarkDao.bookmarkDao = new BookmarkDao();
         }
         return BookmarkDao.bookmarkDao;
     }
     private constructor() {}

     /**
       * Retrieves all users that bookmarked a tuit from the database
       * @param tid Represents id of the tuit
       */

     findAllUsersThatBookmarkedTuit = async (tid: string): Promise<Bookmark[]> =>
         BookmarkModel
             .find({tuit: tid})
             .populate("bookmarkedBy")
             .exec();

     /**
       * Retrieves all tuits that bookmarked a user from the database
       * @param uid Represents id of the user
       */

//       findAllTuitsThatBookmarkedByAUser = async (uid: string): Promise<Bookmark[]> =>
//       BookmarkModel
//           .find({user: uid})
//           .populate("bookmarkedTuit")
//           .exec();

    findAllTuitsThatBookmarkedByAUser = async (uid: string): Promise<Bookmark[]> =>
         BookmarkModel
             .find({bookmarkedBy: uid})
             .populate({
                 path: "bookmarkedTuit",
                 populate: {
                     path: "postedBy"
                 }
             })
             .exec();


     /**
       * Create a bookmark instance
       * @param uid Represents id of the user
       * @param tid Represents id of the tuit
       */
     userBookmarksTuit = async (uid: string, tid: string): Promise<any> =>
         BookmarkModel.create({bookmarkedBy: uid, bookmarkedTuit: tid});

     /**
       * Removes a bookmark instance
       * @param uid Represents id of the user
       * @param tid Represents id of the tuit
       */

     userUnbookmarksTuit = async (uid: string, tid: string): Promise<any> =>
         BookmarkModel.deleteOne({bookmarkedTuit: tid, bookmarkedBy: uid});

     findUserBookmarksTuit = async (uid: string, tid: string): Promise<any> =>
             BookmarkModel.findOne({bookmarkedTuit: tid, bookmarkedBy: uid});

    countHowManyBookmarkedTuit = async (tid: string): Promise<any> =>
            BookmarkModel.count({bookmarkedTuit: tid});
 }