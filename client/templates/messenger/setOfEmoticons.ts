///<reference path="../../../typings/meteor/meteor.d.ts" />

Template['emoticons'].events({
    'click .css-emoticon': function(event) {
        var callback = this.callback;
        callback.call(this, event.target.innerHTML);
    }
});