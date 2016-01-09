Avatar.setOptions({
    imageSizes: {
        'large': 80,
        'mySize': 50,
        'extra-small': 32
    },
    backgroundColor: "#d4d3d4",
    color: "#033C6D",
    customImageProperty: function(){
        var user = this;

        if (user && user.profile && user.profile.avatar)
        {
            return "/"+ user.profile.avatar;
        }
        return null;
    },
    fallbackType: "initials",
});
