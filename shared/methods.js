Meteor.methods({
    addChatMessage: function (messages, currentChatId) {
        var chat = Chats.findOne({_id:currentChatId});
        chat.messages = messages;
        // update the chat object in the database.
        Chats.update({"_id": chat._id}, chat);
        return chat.messages;
    },

    createNewChatId: function(secondId){
        var chatId = Chats.insert({user1Id:Meteor.userId(), user2Id:secondId});
        console.log( "chat id : " + chatId);
        return chatId;
    }
})