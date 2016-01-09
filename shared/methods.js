/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../shared/collections.ts" />
/// <reference path="../shared/ChatService.ts" />
/// <reference path="../shared/editDocsCollections.ts" />
Meteor.methods({
    addChatMessage: function (messages, currentChatId) {
        return chatService.updateChatMessages(messages, currentChatId);
    },
    createNewChatId: function (secondId) {
        return chatService.createNewChatId(secondId);
    },
    updateDocPrivacy: function (doc) {
        console.log("update doc privacy method");
        console.log(doc);
        var realDoc = Documents.findOne({ _id: doc._id, owner: this.userId });
        if (realDoc) {
            realDoc.isPrivate = doc.isPrivate;
            Documents.update({ _id: realDoc._id }, realDoc);
        }
    },
    addDoc: function () {
        var doc;
        if (!this.userId) {
            return undefined;
        }
        else {
            doc = { owner: this.userId, createdOn: new Date(), title: "my new doc" };
            var id = Documents.insert(doc);
            console.log("add doc method: " + id);
            return id;
        }
    },
    addEditingUsers: function (docid) {
        var doc, userProfile, eusers;
        doc = Documents.findOne({ _id: docid });
        if (!doc) {
            return;
        } //no doc
        if (!this.userId) {
            return;
        } // no logged in user
        userProfile = Meteor.user().profile;
        eusers = EditingUsers.findOne({ docid: doc._id });
        if (!eusers) {
            eusers = {
                docid: doc._id,
                users: {},
            };
        }
        userProfile.lastEdit = new Date();
        eusers.users[this.userId] = userProfile;
        EditingUsers.upsert({ _id: eusers._id }, eusers);
    }
});
//# sourceMappingURL=methods.js.map