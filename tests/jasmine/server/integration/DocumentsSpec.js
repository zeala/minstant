describe("Documents collection", function(){

    beforeEach(function(){
        //create a document stub
        Documents = {
            findOne: function(params){
                if(params){
                    return 1;
                }else{
                    return 0;
                }
            }
        }
    });

    it("should check that one document exists", function(){
        expect(Documents.findOne("validParam")).toBe(1);
    });

    it ("should confirm that the Documents collection is empty", function(){
        expect(Documents.findOne(null)).toBe(0);

        spyOn(Documents, "findOne");

        Documents.findOne();
        expect(Documents.findOne).toHaveBeenCalled();
    });

    it("tracks the number of times the method findOne was called", function(){
        spyOn(Documents, "findOne");
        expect(Documents.findOne.calls.count()).toEqual(0);

        Documents.findOne(null);
        Documents.findOne(null);

        expect(Documents.findOne.calls.count()).toEqual(2);
    });

    it("provides the context (this) and the parameters passed", function(){
        spyOn(Documents, "findOne");
        Documents.findOne("myParams");
        expect(Documents.findOne.calls.count()).toEqual(1);
        expect(Documents.findOne.calls.first()).not.toBeUndefined();
    })
})