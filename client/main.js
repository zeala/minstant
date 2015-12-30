Meteor.startup(function(){
    Session.set("data_loaded", false);
})

Meteor.subscribe("chats", function(){
    Session.set("data_loaded", true);
});

Meteor.subscribe("users");

var messages = new ReactiveVar(undefined);

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
        messages.set(chat.messages);
    }

    this.render("navbar", {to:"header"});
    this.render("chat_page", {to:"main"});
});

///
// helper functions
///
Template.available_user_list.helpers({
    users:function(){
        console.log("available user list");
        console.log(Meteor.users.find().fetch());
        return Meteor.users.find();
    }
})
Template.available_user.helpers({
    getUsername:function(userId){
        user = Meteor.users.findOne({_id:userId});
        return user.profile.username;
    },
    isMyUser:function(userId){
        if (userId == Meteor.userId()){
            return true;
        }
        else {
            return false;
        }
    }
})


Template.chat_page.rendered = function(){
    $('.chat-message-wrapper').emoticonize({delay: 300});
}


Template.chat_page.created = function(){
    console.log("!!! chat page created");
    console.log("chat id from created : " + Session.get("chatId"));
    this.subscribe("chats");
    Meteor.subscribe("singleChat", Session.get("chatId"));

};

Template.chat_page.helpers({
    chat_messages:function(){
        var sessionChatId = Session.get("chatId");
        var chat = Chats.findOne({_id:Session.get("chatId")});
        var msgs = messages.get();

        return msgs;
        return chat.messages;

    },
    other_user:function(){
        return ""
    },

});

Template.chat_page.events({
    // this event fires when the user sends a message on the chat page
    'submit .js-send-chat':function(event){

        // see if we can find a chat object in the database
        // to which we'll add the message
        var chat = Chats.findOne({_id:Session.get("chatId")});
        //console.log(chat);
        if (chat) {// ok - we have a chat to use
            var msgs = chat.messages; // pull the messages property

            if (!msgs) {// no messages yet, create a new array
                msgs = [];
                console.log(" no chat messages yet")
            }
            // is a good idea to insert data straight from the form
            // (i.e. the user) into the database?? certainly not.
            // push adds the message to the end of the array
            msgs.push({text: event.target.chat.value});
            // reset the form
            event.target.chat.value = "";
            // put the messages array onto the chat object
            //$('.all-messages').emoticonize();//({delay: 500});

            Meteor.call("addChatMessage", msgs, Session.get("chatId"), function(error, result){
                //console.log(result);

            });

            setTimeout(emoticonize, 100);
            //$('.chat-message-wrapper').emoticonize({delay: 300});
            chat.messages = msgs;

        }

        // stop the form from triggering a page reload
        event.preventDefault();
        messages.set(msgs);
    }
});

function emoticonize(){
    $('.chat-message-wrapper').emoticonize({delay: 300});
}