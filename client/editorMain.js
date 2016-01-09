Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");
Meteor.subscribe("comments");


Template.editor.helpers({
    docid: function(){
        setupCurrentDocument();
        return Session.get("docid");
    },

    config: function(){
        return function(editor){
            console.log(editor);
            editor.setOption("lineNumbers", true);
            editor.setOption("mode", "html");
            editor.setOption("theme", "cobalt")
            editor.on("change", function(cm_editor, info){
                console.log(cm_editor.getValue());
                $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
                Meteor.call("addEditingUsers", Session.get("docid"));
            })
        }
    }
});

Template.editingUsers.helpers({
    users: function(){
        var users;
        var doc;

        doc = Documents.findOne({_id:Session.get("docid")});
        if (!doc){ return;}
        eusers = EditingUsers.findOne({docid: doc._id});

        if (!eusers){ return};

        users = new Array();
        var i = 0
        for (var user_id in eusers.users){
            users[i] = fixObjectKeys(eusers.users[user_id]);
            i++;
        }
        return users;
    }
});

Template.navbar.helpers({
    documents: function(){
        return Documents.find()
    }
});

Template.docMeta.helpers({
    document:function(){
        return Documents.findOne({_id:Session.get("docid")})
    },
    canEdit:function(){
        var doc;

        doc = Documents.findOne({_id:Session.get("docid")});
        if (doc){
            if (doc.owner == Meteor.userId()){
                return true;
            }
        }
        return false;
    }
});

Template.editableText.helpers({
    userCanEdit: function(doc, Collection){
        doc = Documents.findOne({_id:Session.get("docid"), owner: Meteor.userId()});
        if (doc){
            return true;
        }
        else{
            return false;
        }
    }
});


Template.docList.helpers({
    documents: function(){
        return Documents.find()
    }
});

Template.commentList.helpers({
    comments: function(){
        return Comments.find({docid: Session.get("docid")})
    }
})

Template.insertCommentForm.helpers({
    docid: function(){
        return Session.get("docid");
    }
})

//-------------------------------------------------------//
//                EVENTS
//-------------------------------------------------------//
Template.docMeta.events({
    "click .js-tog-private": function(event){
        console.log(event.target.checked);

        var doc = {_id: Session.get("docid"), isPrivate: event.target.checked};
        Meteor.call("updateDocPrivacy", doc);
    }
});

Template.navbar.events({
    "click .js-add-doc": function(event){
        event.preventDefault();
        console.log("add new doc");

        if (!Meteor.user()){
            alert("You need to login first");
        }
        else{
            //user is logged in
            var id =  Meteor.call("addDoc", function(error, result){
                if (error) { return }
                console.log(" got an id from async call : " + result);
                Session.set("docid", result);
            });
        }
    },
    "click .js-load-doc": function(event){
        Session.set("docid", this._id)
    }
});


//------------------------------------------------//
//          helper methods
//------------------------------------------------//

function setupCurrentDocument(){
    var doc;
    if (!Session.get("docid")){
        doc = Documents.findOne();
        if (doc){
            Session.set("docid", doc._id);
        }
    }
}

function fixObjectKeys(obj){
    var newObj = {};

    for (key in obj){
        var key2 = key.replace("-", "");
        newObj[key2] = obj[key];
    }

    return newObj;
}

