///<reference path="../../../typings/meteor/meteor.d.ts" />

Template['emoticons'].events({
    'click .css-emoticon': function(event) {
        console.log("emoticons callback")
        console.log(this);
        console.log(callback);
        var callback = this.callback;
        callback.call(this, event.target.innerHTML);
    }
});