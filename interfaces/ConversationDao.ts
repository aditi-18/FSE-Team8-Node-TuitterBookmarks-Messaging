import {Request, Response} from "express";
import Conversation from "../models/Conversation";

export default interface ConversationDao {
    createConversation(uid1: string, uid2: string): Promise<Conversation>;
    findConversationOfUser(uid1: string): Promise<Conversation[]>
    findConversationOfBothUsers(uid1: string, uid2: string): Promise<Conversation[]>;
    deleteConversation(cid: string): Promise<any>;
 }
 