/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />

class ChatService{

    public findSessionChatMessages():Array<Object> {
        var chat = Chats.findOne({_id:Session.get("chatId")});
        var msgs:Array<Object> = [];
        if (chat && chat.messages){
            msgs = chat.messages;
        }
        return msgs;
    }

    public findChatByUserId = function(secondUserId:string):IChats{
        var filter = {$or:[
            {user1Id:Meteor.userId(), user2Id:secondUserId},
            {user2Id:Meteor.userId(), user1Id:secondUserId}
        ]};

        var chat = Chats.findOne(filter);
        return chat;
    };

    public findChatById = function(id:String):IChats{
        var chat = Chats.findOne({_id:id});
        return chat
    };

    public getSessionChatId = function():string{
        var chat = Chats.findOne({_id:Session.get("chatId")});
        var chatId:string = chat._id;
        return chatId;
    };

    public updateChatMessages = function(messages:Array<Object>, chatId?:string):Array<Object>{

        if (!chatId){
           chatId = this.getSessionChatId();
        }
        var chat = Chats.findOne({_id:chatId});
        chat.messages = messages;
        chat.updated = new Date();
        // update the chat object in the database.
        var updatedChatId:number = Chats.update({"_id": chat._id}, chat);
        return chat.messages;
    };

    public createNewChatId(secondUserId:string, firstUserId?:string):string{

        firstUserId = firstUserId ? firstUserId : this.getCurrentUserId();

        var chat:IChats = {user1Id:firstUserId, user2Id:secondUserId};
        var chatId:string = Chats.insert(chat);
        return chatId;
    }

    private getCurrentUserId():string{
        return Meteor.userId();
    }
}

declare var chatService:ChatService;
chatService = new ChatService();
