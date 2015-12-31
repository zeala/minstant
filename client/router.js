Router.configure({
    layoutTemplate: 'ApplicationLayout'
});
// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
    console.log("rendering root /");
    this.render("navbar", {to:"header"});
    this.render("lobby_page", {to:"main"});
});

// specify a route that allows the current user to chat to another users
Router.route('/chat/:_id', function () {

    //first check if the data is loaded
    if (Session.get("data_loaded") == false){
        return;
    }


    // the user they want to chat to has id equal to
    // the id sent in after /chat/...
    var otherUserId = this.params._id;
    // find a chat that has two users that match current user id
    // and the requested user id
    var filter = {$or:[
        {user1Id:Meteor.userId(), user2Id:otherUserId},
        {user2Id:Meteor.userId(), user1Id:otherUserId}
    ]};

    var chat = Chats.findOne(filter);
    console.log("found chat : ")
    //console.log(chat)
    if (!chat){// no chat matching the filter - need to insert a new one
        chatId = Meteor.call("createNewChatId",this.params._id, function(error, result){
            if (error){
                console.log(error);
                return;
            }
            console.log("!!!! GOT NEW CHAT ID ")
            //Session.set("chatId",chatId);
        } );

    }
    else {// there is a chat going already - use that.
        chatId = chat._id;
        Session.set("chatId",chatId);
        //messages.set(chat.messages);
        setTimeout(emoticonize, 300);
    }

    this.render("navbar", {to:"header"});
    this.render("chat_page", {to:"main"});
    this.render("all_users", {to:"left"});
});

function emoticonize(){
    $('.chat-message-wrapper').emoticonize({delay: 300});
    $("#chatContainer").animate({scrollTop:$("#chatContainer")[0].scrollHeight}, 1000);
}
