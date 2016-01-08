/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />

module ChatModule{
    export class ChatService{
        public findChatById = function(id:String){
            var chat = Chats.findOne({_id:id});
            return chat
        };

        public updateChatMessages = function(chatId:string, messages:Array<Object>):void{

        }
    }
};

