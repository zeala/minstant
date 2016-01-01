Template.emoticons.helpers({

});

Template.emoticons.events({
    'click .css-emoticon': function(event){
        var callback = Template.currentData().callback;
        callback.call(this, event.target.innerHTML);
    }
});