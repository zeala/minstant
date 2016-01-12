describe("Chat Service", function(){
     beforeEach(function () {
         //MeteorStubs.install();
         //mock(global, 'Chats');
     });

    afterEach(function () {
        var user1Id = "user1Id"
        var user2Id = "user2Id";
        var filter = {$or:[
            {user1Id:user1Id, user2Id:user2Id},
            {user2Id:user2Id, user1Id:user1Id}
        ]};

        var chat = Chats.findOne(filter);
        if (chat){
            Chats.remove({_id: chat._id});
        }

    });
    it("should be able to add a chat to the collection", function(){
        var user1Id = "user1Id"
        var user2Id = "user2Id";
        var chat = {user1Id:user1Id, user2Id:user2Id};
        var chatObj = {};
        spyOn(Chats, "insert").and.returnValue(chat);

        chatService.createNewChatId(user2Id, user1Id);
        expect(Chats.insert).toHaveBeenCalledWith(chat);

        spyOn(Chats, "findOne").and.returnValue(chatObj);
        expect(Chats.find().count()).toBe(1);
    })
});