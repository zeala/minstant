/// <reference path="../typings/meteor/meteor.d.ts" />
interface IChats{
    _id?: string;
    name: string;
    status?: string;
    queuedAt?: string;
    messages?:Array<Object>;
}

interface IChatMessage{
    _id?: string;
    userId:string;
    text:string;
    timestamp:Date;
}

declare var Chats: Mongo.Collection<IChats>;
Chats = new Mongo.Collection<IChats>("chats");
