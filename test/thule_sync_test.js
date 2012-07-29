var assert = require("assert")
require("../thule/thule")


describe('Thule.Sync', function(){
  describe('#isPresent()', function(){
    
    it("should be Synchronous processing", function(done){
      var list = []; 

      var sync = new Thule.Sync();
      sync.next(function(_sync){
        setTimeout(function(){
          list.push(1);
          _sync.finish();
        },200)
      })

      sync.next(function(_sync){
        setTimeout(function(){
          list.push(2);
          _sync.finish();
        },100)
      })

      sync.next(function(_sync){
        assert.equal(1, list[0]);
        assert.equal(2, list[1]);
        assert.equal(2, list.length);
        done();
      })
    });
  
    it("should be Synchronous processing", function(done){
      var flag = false; 
      var list = [];
      var sync = new Thule.Sync();
       
      sync.next(function(){
        flag = false;
        setTimeout(function(){
          list.push(1);
          flag = true;
        }, 200);
      }, function(_sync){ if(flag) _sync.finish() })

      sync.next(function(){
        flag = false;
        setTimeout(function(){
          list.push(2);
          flag = true;
        }, 100);
      }, function(_sync){ if(flag) _sync.finish() })

      sync.next(function(_sync){
        assert.equal(1, list[0]);
        assert.equal(2, list[1]);
        assert.equal(2, list.length);
        done();
      })
    });
  
    it("should be Asynchronous processing", function(done){
      var list = []; 

      setTimeout(function(){
        list.push(1);
      },200)

      setTimeout(function(){
        list.push(2);
      },100)

      setTimeout(function(){
        assert.equal(2, list[0]);
        assert.equal(1, list[1]);
        assert.equal(2, list.length);
        done();
      },300)
    });
  
  });
})
