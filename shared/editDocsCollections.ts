/// <reference path="../typings/meteor/meteor.d.ts" />

interface IEditingUser{
    _id?: string;
    users?: Array<Object>
}

interface IDocuments{
    _id?:string;
}

declare var EditingUsers:Mongo.Collection<IEditingUser>
EditingUsers = new Mongo.Collection<IEditingUser>("editingUsers");

declare var Documents: Mongo.Collection<IDocuments>
Documents = new Mongo.Collection<IDocuments>("documents");
