/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />
/// <reference path="../shared/ChatService.ts" />

Meteor.methods({
    addChatMessage: function (messages:IChatMessage[], currentChatId:string):Array<Object> {
        return chatService.updateChatMessages(messages, currentChatId);
    },

    createNewChatId: function(secondId:string):string{
        return chatService.createNewChatId(secondId);
    },
});