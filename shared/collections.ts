/// <reference path="../typings/meteor/meteor.d.ts" />
interface IChats{
    _id?: string;
    user1Id:string;
    user2Id:string;
    name?: string;
    messages?:Array<Object>;
    updated?:Date
}

interface IChatMessage{
    _id?: string;
    userId:string;
    text:string;
    timestamp:Date;
}

declare var Chats: Mongo.Collection<IChats>;
Chats = new Mongo.Collection<IChats>("chats");
