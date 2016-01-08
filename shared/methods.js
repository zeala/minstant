/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />
/// <reference path="../shared/ChatService.ts" />
Meteor.methods({
    addChatMessage: function (messages, currentChatId) {
        return chatService.updateChatMessages( messages, currentChatId);
    },
    createNewChatId: function (secondId) {
        return chatService.createNewChatId(secondId);
    },
});
//# sourceMappingURL=methods.js.map