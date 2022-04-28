import {Request, Response} from "express";

/**
 * @file Declares interface for Bookmark Controller.
 */
export default interface BookmarkController {
    findAllUsersThatBookmarkedTuit (req: Request, res: Response): void;
    findAllTuitsThatBookmarkedByAUser (req: Request, res: Response): void;
    userBookmarksTuit (req: Request, res: Response): void;
    userUnbookmarksTuit (req: Request, res: Response): void;
    userTogglesTuitBookmarks (req: Request, res: Response): void;

};