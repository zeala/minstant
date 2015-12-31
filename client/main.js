/*Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});*/

Meteor.startup(function(){
    Session.set("data_loaded", false);
});

Meteor.subscribe("chats", function(){
    Session.set("data_loaded", true);
});

Meteor.subscribe("users");


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
        var name = user.profile.username ? user.profile.username : user.profile.name;
        return name;
    },
    userImage: function(userId){
        user = Meteor.users.findOne({_id:userId});
        var userImage = user.profile.avatar;

        userImage = userImage ? userImage : "ava1.png";
        console.log("userImage : " + userImage+ " username : " + user.profile.username);
        return userImage;
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
    emoticonize();
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

        console.log(msgs)
        return msgs;

    },
    other_user:function(){
        return ""
    },

});

Template.chat_message.helpers({
    user: function(){
        console.log( " --- from chat message --- ")
        console.log(Template.currentData());
        console.log(Template.parentData())
    }
})

Template.chat_page.events({
    'submit .js-send-chat':function(event){

        var chat = Chats.findOne({_id:Session.get("chatId")});
        if (chat) {// ok - we have a chat to use
            var msgs = chat.messages; // pull the messages property

            if (!msgs) {// no messages yet, create a new array
                msgs = [];
                console.log(" no chat messages yet")
            }
            msgs.push({text: event.target.chat.value, userId: Meteor.userId()});
            // reset the form
            event.target.chat.value = "";

            Meteor.call("addChatMessage", msgs, Session.get("chatId"), function(error, result){
            });

            setTimeout(emoticonize, 100);
            chat.messages = msgs;
        }
        event.preventDefault();
    }
});

function emoticonize(){
    $('.chat-message-wrapper').emoticonize({delay: 300});
    $("#chatContainer").animate({scrollTop:$("#chatContainer")[0].scrollHeight}, 1000);
}