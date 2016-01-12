/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />
var ChatService = (function () {
    function ChatService() {
        this.findChatByUserId = function (secondUserId) {
            var filter = { $or: [
                { user1Id: Meteor.userId(), user2Id: secondUserId },
                { user2Id: Meteor.userId(), user1Id: secondUserId }
            ] };
            var chat = Chats.findOne(filter);
            return chat;
        };
        this.findChatById = function (id) {
            var chat = Chats.findOne({ _id: id });
            return chat;
        };
        this.getSessionChatId = function () {
            var chat = Chats.findOne({ _id: Session.get("chatId") });
            var chatId = chat._id;
            return chatId;
        };
        this.updateChatMessages = function (messages, chatId) {
            if (!chatId) {
                chatId = this.getSessionChatId();
            }
            var chat = Chats.findOne({ _id: chatId });
            chat.messages = messages;
            chat.updated = new Date();
            // update the chat object in the database.
            var updatedChatId = Chats.update({ "_id": chat._id }, chat);
            return chat.messages;
        };
    }
    ChatService.prototype.findSessionChatMessages = function () {
        var chat = Chats.findOne({ _id: Session.get("chatId") });
        var msgs = [];
        if (chat && chat.messages) {
            msgs = chat.messages;
        }
        return msgs;
    };
    ChatService.prototype.createNewChatId = function (secondUserId, firstUserId) {
        firstUserId = firstUserId ? firstUserId : this.getCurrentUserId();
        var chat = { user1Id: firstUserId, user2Id: secondUserId };
        var chatId = Chats.insert(chat);
        return chatId;
    };
    ChatService.prototype.getCurrentUserId = function () {
        return Meteor.userId();
    };
    return ChatService;
})();
chatService = new ChatService();
//# sourceMappingURL=ChatService.js.map