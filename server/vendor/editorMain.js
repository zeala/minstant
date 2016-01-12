Meteor.publish("comments", function(){
    return Comments.find()
})