Template.all_users.created = function(){
    this.chatroomVisits = new ReactiveDict();
    this.chatroomVisits.startTime = new Date();
};

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

    myUser:function(){
        return Meteor.user()
    },

    isSecondUser: function(userId){
        var sessionChatId = Session.get("chatId");
        var chat = Chats.findOne({_id:Session.get("chatId")});

        var user1Id = chat.user1Id;
        var user2Id = chat.user2Id;
        var secondUserId = user1Id == Meteor.userId() ? user2Id : user1Id;

        return userId == secondUserId;

    },
    lastVisited: function(userId){
        var sessionChatId = Session.get("chatId");
        var filter = {$or:[
            {user1Id:Meteor.userId(), user2Id:userId},
            {user2Id:Meteor.userId(), user1Id:userId}
        ]};

        var chat = Chats.findOne(filter);

        var dict = Template.instance().chatroomVisits;
        if (dict && dict[chat._id]){
            var timeLeftChat = dict[chat._id].timeLeft;
            if (timeLeftChat)
            {
                var formattedTime = moment(timeLeftChat).format("ddd hh:mm");
                return formattedTime;
            }
            return dict[chat._id].timeLeft;
        }
        return;
    },

    isUserOnline: function(userId){
        var user = Meteor.users.findOne({_id:userId});
        return user && user.status.online == true;
    },

    isNotMainUser: function(userId){
        return   userId != Meteor.userId();
    },
    displayUserName: function(userId){
        var user = Meteor.users.findOne({_id:userId});
        var profileUserName = user.profile ? user.profile.username : undefined;
        var username = profileUserName ? profileUserName : user.username;
        return username;
    },

    myChats: function(){
        var userId = Meteor.userId();
        console.log("my chats userId : " + userId);
        console.log(Chats.find().fetch())
        var chats = Chats.find({$or:[{ user1Id: userId}, {user2Id: userId }]}).fetch();
        return chats;
    },

    inactiveChatMessagesCount: function(userId){

        var messages = getInactiveChatMessages(userId);
        return messages && messages.length > 0 ? messages.length : undefined;
    },

    isInactiveWithMessages: function(userId){
        var messages = getInactiveChatMessages(userId);
        return messages && messages && messages.length > 0;
    }
});

Template.all_users.events({
    'click .js-chatroom-visits' : function(event){
        var leftChatId = Session.get("chatId");

        var dict = Template.instance().chatroomVisits;
        if (dict[leftChatId] == undefined){
            dict[leftChatId] = {timeLeft: new Date(), timeEntered: new Date()};
        }
        var chatToUpdate = dict[leftChatId];
        chatToUpdate.timeLeft = new Date();
        Template.instance().chatroomVisits[leftChatId] = chatToUpdate;

        setTimeout(function(){


            var newChatId = Session.get("chatId");

            if (dict[newChatId] == undefined){
                dict[newChatId] = {timeLeft: new Date(), timeEntered: new Date()};
            }
            var chatToUpdate = dict[newChatId];
            chatToUpdate.timeEntered = new Date();
            console.log(Template.instance())
            dict[newChatId] = chatToUpdate
        }, 100);
    }
});


function getInactiveChatMessages(userId){
    var chatUpdated = Session.get("chatUpdated");
    var filter = {$or:[
        {user1Id:Meteor.userId(), user2Id:userId},
        {user2Id:Meteor.userId(), user1Id:userId}
    ]};

    var chat = Chats.findOne(filter);

    if(!chat || chat.messages == undefined || chat.messages.length == 0){
        return;
    };

    var activeSessionChat = Session.get("chatId");


    if (chat._id == activeSessionChat){
        return;
    }

    var dict = Template.instance().chatroomVisits;
    var lastVisited = dict[chat._id] ? dict[chat._id].timeLeft : dict.startTime;

    if ( !chat || ! chat.messages) return;
    var messages = chat.messages.filter(function(element){
        return element.timestamp > lastVisited;
    });
    return messages;
}

function updateEnterTimestamp(chatId){

}