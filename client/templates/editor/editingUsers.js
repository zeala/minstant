Template.editingUsers.helpers({
    editingUsers: function(){
        if (EditingUsers.findOne())
        {
            return EditingUsers.findOne().users;
        }

        return false;
    }
});