/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />

Meteor.methods({
    addChatMessage: function (messages:IChatMessage[], currentChatId:String):Array<Object> {
        var chat = Chats.findOne({_id:currentChatId});
        chat.messages = messages;
        chat.updated = new Date();
        // update the chat object in the database.
        Chats.update({"_id": chat._id}, chat);
        return chat.messages;
    },

    createNewChatId: function(secondId:string):string{
        var chat:IChats = {user1Id:Meteor.userId(), user2Id:secondId};
        var chatId:string = Chats.insert(chat);
        return chatId;
    },
});