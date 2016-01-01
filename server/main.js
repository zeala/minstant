Avatar.setOptions({
    imageSizes: {
        'large': 80,
        'mySize': 50,
        'extra-small': 32
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

Meteor.publish("chats", function(){
    console.log("publish chats")
    return Chats.find();
});

Meteor.publish("singleChat", function(chatId){
    return Chats.find({_id: chatId});
})

Meteor.publish("users", function(){
    console.log("PUBLISHING METEOR USERS");
    console.log(Meteor.users.find());
    return Meteor.users.find();
})


Meteor.startup(function () {
    if (!Meteor.users.findOne()){
        for (var i=1;i<9;i++){
            var email = "user"+i+"@test.com";
            var username = "user"+i;
            var avatar = "ava"+i+".png"
            console.log("creating a user with password 'test123' and username/ email: "+email);
            Meteor.users.insert({profile:{username:username, avatar:avatar}, emails:[{address:email}],services:{ password:{"bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"}}});
        }
    }

    console.log("Users : ");
    console.log(Meteor.users);
});