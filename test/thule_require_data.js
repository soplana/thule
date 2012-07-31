var assert = require("assert")
require("../thule/thule")


describe('Thule.Func', function(){
  describe('#isPresent()', function(){
    
    it('true should be present', function(){
      assert.equal(true, Thule.Func.isPresent(true));
    });

  });
})
