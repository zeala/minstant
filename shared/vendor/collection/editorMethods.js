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
});