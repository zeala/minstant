/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../typings/jquery.d.ts" />
/// <reference path="../typings/ironrouter.d.ts" />
/// <reference path="../shared/collections.ts" />
/// <reference path="../shared/ChatService.ts" />

Router.configure({
    layoutTemplate: 'ApplicationLayout',
    loadingTemplate: 'loading'
});
// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
    console.log("rendering root /");
    this.render("navbar", {to:"header"});
    //this.render("lobby_page", {to:"main"});
    this.render("lobby_page", {to:"fullPage"});
    this.render("footer", {to:"footer"});
});

Router.route("/editor", function(){
    this.render("navbar", {to:"header"});
    this.render("editorContainer", {to: "fullPage"});
    //this.render("", {to:"main"});
});

Router.route('/documents', function(){
    console.log("you hit /");
    this.render("navbar", {to: "header"});
    this.render("docList", {to: "main"});
});

Router.route('/documents/:_id', function(){
    console.log("you hit documents " + this.params._id);
    Session.set("docid", this.params._id);
    this.render("navbar", {to: "header"});
    //this.render("docItem", {to: "main"});
    this.render("docItem", {to: "fullPage"});
});


// specify a route that allows the current user to chat to another users
Router.route('/chat/:_id', function () {

    //first check if the data is loaded
    if (Session.get("data_loaded") == false){
        return;
    }

    var otherUserId:string = this.params._id;
    var chat:IChats = chatService.findChatByUserId(otherUserId);
    var chatId:string = chat ? chat._id : undefined;

    if (!chat){// no chat matching the filter - need to insert a new one
        chatId = Meteor.call("createNewChatId",this.params._id)
    }
    else {// there is a chat going already - use that.
        chatId = chat._id;
        Session.set("chatId",chatId);
        if (chat.messages && chat.messages.length > 0){
            setTimeout(emoticonize, 300);
        }
    }

    this.render("navbar", {to:"header"});
    //this.render("chat_page", {to:"main"});
    //this.render("", {to:"fullPage"});
    this.render("chat_page", {to: "fullPage"});
});



function emoticonize(){
    $('.chat-message-wrapper').emoticonize({delay: 300});
    $("#chatContainer").animate({scrollTop:$("#chatContainer")[0].scrollHeight}, 1000);
}
