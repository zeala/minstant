Template.commentList.helpers({
    comments: function(){
        return Comments.find({docid: Session.get("docid")})
    }
})