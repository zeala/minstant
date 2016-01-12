/// <reference path="../../../typings/meteor/meteor.d.ts" />
/// <reference path="../../../typings/jquery.d.ts" />
/// <reference path="../../../shared/collections.ts" />
Template['listDocs'].helpers({
    documents: function () {
        return Documents.find();
    }
});
Template['listDocs'].events({
    "click .js-add-doc": function (event) {
        event.preventDefault();
        console.log("add new doc");
        if (!Meteor.user()) {
            alert("You need to login first");
        }
        else {
            //user is logged in
            var id = Meteor.call("addDoc", function (error, result) {
                if (error) {
                    return;
                }
                console.log(" got an id from async call : " + result);
                Session.set("docid", result);
            });
        }
    },
    "click .js-load-doc": function (event) {
        Session.set("docid", this._id);
    }
});
//# sourceMappingURL=listDocs.js.map