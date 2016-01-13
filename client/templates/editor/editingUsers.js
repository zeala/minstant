Template.editingUsers.helpers({
    editingUsers: function(){
        console.log("Editing users, find one : ");
        console.log(EditingUsers.findOne());
        if (EditingUsers.findOne())
        {
            return EditingUsers.findOne().users;
        }
    }
})