Avatar.setOptions({
    imageSizes: {
        'large': 80,
        'mySize': 50,
        'extra-small': 25
    },
    customImageProperty: function(){
        var user = this;

        if (user && user.profile && user.profile.avatar)
        {
            console.log("user.profile.avatar : " + user.profile.avatar);
            return "/"+ user.profile.avatar;
        }
        return null;
    },
    fallbackType: "initials",
});

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
});

Template.all_users.helpers({
    users:function(){
        console.log("available user list");
        console.log(Meteor.users.find().fetch());
        return Meteor.users.find();
    },
    userImage: function(userId){
        user = Meteor.users.findOne({_id:userId});
        var userImage = user.profile.avatar;

        userImage = userImage ? userImage : "ava1.png";
        return userImage;
    },
    isMyUser:function(userId){
        if (userId == Meteor.userId()){
            return true;
        }
        else {
            return false;
        }
    },

    displayUserName: function(userId){
        user = Meteor.users.findOne({_id:userId});
        var profileUserName = user.profile ? user.profile.username : undefined;
        var username = profileUserName ? profileUserName : user.username;
        return username;
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
    this.enteredEmoticon = new ReactiveVar("");
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
    selectEmoticonCallback: function(val){
        console.log(val);
        var callback = function(val){
            console.log( " val from callback : " + val);
            $('#textAreaNewChat').val($('#textAreaNewChat').val() + " " + val);
        };

        return callback;
    }
});

Template.chat_message.helpers({
    username: function(){
        var chatMessage = Template.currentData();
        var user = Meteor.users.findOne({"_id":chatMessage.userId});
        if (user){
            var name = user.profile.username ? user.profile.username : user.profile.name;
            name = name ? name : "You ";
            return name;
        }
        return;
    },

    user: function(){
        var chatMessage = Template.currentData();
        var user = Meteor.users.findOne({"_id":chatMessage.userId});
        return user;
    },

    isCurrentUser: function(){
        var chatMessage = Template.currentData();
        var user = Meteor.users.findOne({"_id":chatMessage.userId});
        var currentUser = Meteor.user();
        if (user && currentUser) {
            return user._id == currentUser._id;
        }
        return null;
    },

    isSecondUser: function(){
        var chatMessage = Template.currentData();
        var user = Meteor.users.findOne({"_id":chatMessage.userId});
        var currentUser = Meteor.user();
        if (user && currentUser)
        {
            return user._id != currentUser._id;
        }
        return null;
    },

})

Template.chat_page.events({
    'submit .js-send-chat':function(event){

        sendChat(event);
        event.preventDefault();
    },

    'keyup #textAreaNewChat': function(event){
        console.log(event.keyCode)
        if (event.keyCode == 13 && !event.ctrlKey) {
            sendChat(event);
            event.preventDefault();
        }else if (event.keyCode == 13 && event.ctrlKey){
            $(this).val(function(i,val){
                return val + "\n";
            });
        }
    }
});


function sendChat(event){
    var chat = Chats.findOne({_id:Session.get("chatId")});
    if (chat) {// ok - we have a chat to use
        var msgs = chat.messages; // pull the messages property

        if (!msgs) {// no messages yet, create a new array
            msgs = [];
            console.log(" no chat messages yet")
        }
        msgs.push({text: $('#textAreaNewChat').val(), userId: Meteor.userId()});
        // reset the form
        $('#textAreaNewChat').val("");

        Meteor.call("addChatMessage", msgs, Session.get("chatId"), function(error, result){
        });

        setTimeout(emoticonize, 100);
        chat.messages = msgs;
    }
}

function emoticonize(){
    $('.chat-message-wrapper').emoticonize({delay: 300});
    $("#chatContainer").animate({scrollTop:$("#chatContainer")[0].scrollHeight}, 1000);
}