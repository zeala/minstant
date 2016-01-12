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

interface IEditingUser{
    _id?: string;
    users?: {}
}

interface IDocuments{
    _id?:string;
    isPrivate?:boolean;
    owner?:string;
    createdOn?:Date;
}

declare var EditingUsers:Mongo.Collection<IEditingUser>
EditingUsers = new Mongo.Collection<IEditingUser>("editingUsers");

declare var Documents: Mongo.Collection<IDocuments>
Documents = new Mongo.Collection<IDocuments>("documents");

declare var Chats: Mongo.Collection<IChats>;
Chats = new Mongo.Collection<IChats>("chats");
