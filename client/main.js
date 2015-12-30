Meteor.startup(function(){
    Session.set("data_loaded", false);
})

Meteor.subscribe("chats", function(){
    Session.set("data_loaded", true);
});

Meteor.subscribe("users");

//var messages = new ReactiveVar(undefined);

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
    this.subscribe("chats");
    Meteor.subscribe("singleChat", Session.get("chatId"));

};

Template.chat_page.helpers({
    chat_messages:function(){
        var sessionChatId = Session.get("chatId");
        var chat = Chats.findOne({_id:Session.get("chatId")});
        var msgs = chat.messages;//messages.get();

        return msgs;

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
        //messages.set(msgs);
    }
});

function emoticonize(){
    $('.chat-message-wrapper').emoticonize({delay: 300});
}