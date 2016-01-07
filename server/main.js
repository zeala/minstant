Meteor.publish("chats", function(){
    var filter = {$or:[
        {user1Id:this.userId},
        {user2Id:this.userId}
    ]};
    return Chats.find(filter);
});

Meteor.publish("singleChat", function(chatId){
    var filter = {$or:[
        {user1Id:this.userId},
        {user2Id:this.userId}
    ]};
    return Chats.find({_id: chatId}, filter);
})

Meteor.publish("users", function(){
    return Meteor.users.find();
});
Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
});



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
});