/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />
/// <reference path="../shared/ChatService.ts" />
/// <reference path="../shared/editDocsCollections.ts" />

Meteor.methods({
    addChatMessage: function (messages:IChatMessage[], currentChatId:string):Array<Object> {
        return chatService.updateChatMessages(messages, currentChatId);
    },

    createNewChatId: function(secondId:string):string{
        return chatService.createNewChatId(secondId);
    },

    updateDocPrivacy: function(doc:IDocuments){
        console.log("update doc privacy method");
        console.log(doc);
        var realDoc:IDocuments = Documents.findOne({_id:doc._id, owner: this.userId});
        if(realDoc){
            realDoc.isPrivate = doc.isPrivate;
            Documents.update({_id:realDoc._id}, realDoc);
        }
    },

    addDoc:function(): string{
        var doc:IDocuments;
        if (!this.userId){
            return undefined;
        }
        else{
            doc = {owner: this.userId, createdOn: new Date(), title: "my new doc"};
            var id:string = Documents.insert(doc);
            console.log("add doc method: " + id);
            return id;
        }
    },
    addEditingUsers:function(docid:string){
        var doc:IDocuments,
            userProfile:any,
            eusers:IEditingUser;
        doc = Documents.findOne({_id:docid });
        if (!doc) { return;} //no doc
        if (!this.userId){ return;} // no logged in user

        userProfile = Meteor.user().profile;
        eusers = EditingUsers.findOne({docid: doc._id});

        if (!eusers){
            eusers = {
                docid: doc._id,
                users: {},
            };
        }

        userProfile.lastEdit = new Date();
        eusers.users[this.userId] = userProfile;

        EditingUsers.upsert({_id:eusers._id}, eusers);
    }
});