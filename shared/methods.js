/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />
Meteor.methods({
    addChatMessage: function (messages, currentChatId) {
        var chat = Chats.findOne({ _id: currentChatId });
        chat.messages = messages;
        chat.updated = new Date();
        // update the chat object in the database.
        Chats.update({ "_id": chat._id }, chat);
        return chat.messages;
    },
    createNewChatId: function (secondId) {
        var chat = { user1Id: Meteor.userId(), user2Id: secondId };
        var chatId = Chats.insert(chat);
        console.log("Server methods : creating new chat id : " + chatId);
        return chatId;
    },
});
//# sourceMappingURL=methods.js.map