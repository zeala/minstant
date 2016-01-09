Meteor.methods({
    addComment: function(comment){
        console.log("add comment method running")
        if (this.userId){
            comment.createdOn = new Date();
            comment.owner = this.userId;
            return Comments.insert(comment);
        }
        return;
    },

    updateDocPrivacy: function(doc){
        console.log("update doc privacy method");
        console.log(doc);
        var realDoc = Documents.findOne({_id:doc._id, owner: this.userId});
        if(realDoc){
            realDoc.isPrivate = doc.isPrivate;
            Documents.update({_id:realDoc._id}, realDoc);
        }
    },

    addDoc:function(){
        var doc;
        if (!this.userId){
            return;
        }
        else{
            doc = {owner: this.userId, createdOn: new Date(), title: "my new doc"};
            var id = Documents.insert(doc);
            console.log("add doc method: " + id);
            return id;
        }
    },
    addEditingUsers:function(docid){
        var doc, user, eusers;
        doc = Documents.findOne({_id:docid });
        if (!doc) { return;} //no doc
        if (!this.userId){ return;} // no logged in user

        user = Meteor.user().profile;
        eusers = EditingUsers.findOne({docid: doc._id});

        if (!eusers){
            eusers = {
                docid: doc._id,
                users: {},
            };
        }

        user.lastEdit = new Date();
        eusers.users[this.userId] = user;

        EditingUsers.upsert({_id:eusers._id}, eusers);
    }
});