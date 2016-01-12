/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />
/// <reference path="../shared/editDocsCollections.ts" />

Meteor.publish("chats", function(){
    var filter = {$or:[
        {user1Id:this.userId},
        {user2Id:this.userId}
    ]};
    return Chats.find(filter);
});

Meteor.publish("singleChat", (chatId:string)=>{
    var filter = {$or:[
        {user1Id:this.userId},
        {user2Id:this.userId}
    ]};
    return Chats.find({_id: chatId}, filter);
});

Meteor.publish("users", function() {
    return Meteor.users.find();
});
Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
});

Meteor.startup(function () {
    if (!Meteor.users.findOne()){
        for (var i=1;i<9;i++){
            var email:string = "user"+i+"@tests.com";
            var username:string = "user"+i;
            var avatar:string = "ava"+i+".png"
            var profile: any = {username:username, avatar:avatar};
            var userEmail:Meteor.UserEmail = {address:email, verified: false};
            var services:any = { password:{"bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"}}
            Meteor.users.insert({profile:profile, emails:[userEmail],services:services});
        }
    }
});

Meteor.publish("documents", function(){
    return Documents.find({
        $or: [
            {isPrivate:{$ne: true}},
            {owner: this.userId}
        ]});
});

Meteor.publish("editingUsers", function(){
    return EditingUsers.find();
});

Meteor.startup(function () {
    // code to run on server at startup

    if (!Documents.findOne()){
        Documents.insert({title:"new document"});
    }

});