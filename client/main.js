/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../typings/jquery.d.ts" />
/// <reference path="../shared/collections.ts" />
/// <reference path="../shared/ChatService.ts" />
Meteor.startup(function () {
    Session.set("data_loaded", false);
});
Meteor.subscribe("chats", function () {
    Session.set("data_loaded", true);
});
Meteor.subscribe("users");
Meteor.subscribe("userStatus");
///
// helper functions
///
Template['available_user_list'].helpers({
    users: function () {
        return Meteor.users.find();
    }
});
Template['available_user'].helpers({
    getUsername: function (userId) {
        var user = Meteor.users.findOne({ _id: userId });
        var name = user.profile.username ? user.profile.username : user.profile.name;
        return name;
    },
    userImage: function (userId) {
        var user = Meteor.users.findOne({ _id: userId });
        var userImage = user.profile.avatar;
        userImage = userImage ? userImage : "ava1.png";
        return userImage;
    },
    user: function (userId) {
        var user = Meteor.users.findOne({ _id: userId });
        return user;
    },
    isMyUser: function (userId) {
        if (userId == Meteor.userId()) {
            return true;
        }
        else {
            return false;
        }
    }
});
Template['chat_page'].rendered = function () {
    emoticonize();
};
Template['chat_page'].created = function () {
    this.subscribe("chats");
    Meteor.subscribe("singleChat", Session.get("chatId"));
    this.enteredEmoticon = new ReactiveVar("");
};
Template['chat_page'].helpers({
    chat_messages: function () {
        return chatService.findSessionChatMessages();
    },
    other_user: function () {
        return "";
    },
    selectEmoticonCallback: function (val) {
        console.log(val);
        var callback = function (val) {
            console.log(" val from callback : " + val);
            $('#textAreaNewChat').val($('#textAreaNewChat').val() + " " + val);
        };
        return callback;
    },
    isChatEnabled: function () {
        return Meteor.userId && Session.get("chatId");
    },
    noCurrentChat: function () {
        return Session.get("chatId") == undefined;
    }
});
Template['chat_message'].helpers({
    username: function () {
        var chatMessage = Template.currentData();
        var user = Meteor.users.findOne({ "_id": chatMessage.userId });
        if (user) {
            var name = user.profile.username ? user.profile.username : user.profile.name;
            name = name ? name : "You ";
            return name;
        }
        return;
    },
    user: function () {
        var chatMessage = Template.currentData();
        var user = Meteor.users.findOne({ "_id": chatMessage.userId });
        var firstNode = $(Template.instance().firstNode);
        if (firstNode) {
            var span = firstNode.find(".chat-message-wrapper");
            if (span) {
                //NB: this is important , as it replaces the loose text that is left in the inner html
                //when the temlates are rewired.
                //TODO[EM] move to a different location;
                span.text(this.text);
            }
        }
        return user;
    },
    isCurrentUser: function () {
        var chatMessage = Template.currentData();
        var user = Meteor.users.findOne({ "_id": chatMessage.userId });
        var currentUser = Meteor.user();
        if (user && currentUser) {
            return user._id == currentUser._id;
        }
        return null;
    },
    isSecondUser: function () {
        var chatMessage = Template.currentData();
        var user = Meteor.users.findOne({ "_id": chatMessage.userId });
        var currentUser = Meteor.user();
        if (user && currentUser) {
            return user._id != currentUser._id;
        }
        return true;
    },
});
Template['chat_page'].events({
    'submit .js-send-chat': function (event) {
        sendChat(event);
        event.preventDefault();
    },
    'keyup #textAreaNewChat': function (event) {
        if (event.keyCode == 13 && !event.ctrlKey) {
            sendChat(event);
            event.preventDefault();
        }
        else if (event.keyCode == 13 && event.ctrlKey) {
            $(this).val(function (i, val) {
                return val + "\n";
            });
        }
    }
});
function sendChat(event) {
    var msgs = chatService.findSessionChatMessages(); // pull the messages property
    var messageTxt = $('#textAreaNewChat').val();
    msgs.push({ text: messageTxt, userId: Meteor.userId(), timestamp: new Date() });
    // reset the form
    $('#textAreaNewChat').val("");
    Meteor.call("addChatMessage", msgs, Session.get("chatId"), function (error, result) {
    });
    setTimeout(emoticonize, 100);
    chatService.updateChatMessages(msgs);
    Session.set("chatUpdated", chatService.getSessionChatId());
}
function emoticonize() {
    $('.chat-message-wrapper').emoticonize({ delay: 300 });
    $("#chatContainer").animate({ scrollTop: $("#chatContainer")[0].scrollHeight }, 1000);
}
//# sourceMappingURL=main.js.map