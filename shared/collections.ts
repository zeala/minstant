/// <reference path="../typings/meteor/meteor.d.ts" />

interface IChats{
    _id?: string;
    name: string;
    status?: string;
    queuedAt?: string;
}

declare var Chats: Mongo.Collection<IChats>;
Chats = new Mongo.Collection<IChats>("chats");