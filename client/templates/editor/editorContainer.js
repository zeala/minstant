/// <reference path="../../../typings/meteor/meteor.d.ts" />
/// <reference path="../../../typings/jquery-layout.d.ts" />
Template['editorContainer'].rendered = function () {
    $(".documentEditor").layout({
        applyDefaultStyles: true,
        east__size: 400
    });
};
//# sourceMappingURL=editorContainer.js.map