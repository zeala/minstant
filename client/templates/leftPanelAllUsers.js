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
        console.log("My user : ");
        console.log(Meteor.user());
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

    isNotMainUser: function(userId){
        return   userId != Meteor.userId();
    },
    displayUserName: function(userId){
        user = Meteor.users.findOne({_id:userId});
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
    }
});

Template.all_users.events({
    'click .js-chatroom-visits' : function(event){
        console.log(Template.instance().chatroomVisits)
        console.log("SEssion.chatId : " + Session.get("chatId"));
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

        console.log("updated reactive dict : ");
        console.log(Template.instance().chatroomVisits);
    }
});

function updateEnterTimestamp(chatId){

}