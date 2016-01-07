describe('Collection: Chats', function(){

   it('some chats are available in the collection', function(){

       var testChat = Chats.findOne();
       if (!testChat){
           var testId = "testId";
           var user1Id = this.userId;
           var chat = {user1Id:user1Id, user2Id: testId};
           Chats.insert(chat);
       }
       expect(Chats.find().count()).toBeGreaterThan(0);

   });

    it('a chat doesnt exist for the user - undefined', function(){

        var testId = "testId";
        var testChat = Chats.findOne({user2Id: testId});
        if (testChat){
            Chats.remove({_id:testChat._id})
        }

        expect(Chats.findOne({user2Id: testId})).toBeUndefined();
    })
});