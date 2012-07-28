var assert = require("assert")
require("../thule")


describe('Thule.Func', function(){
  describe('#isPresent()', function(){
    
    it('true should be present', function(){
      assert.equal(true, Thule.Func.isPresent(true));
    });
    
    it('false should not be present', function(){
      assert.equal(false, Thule.Func.isPresent(false));
    });
    
    it('null should not be present', function(){
      assert.equal(false, Thule.Func.isPresent(null));
    });
    
    it('undefined should not be present', function(){
      assert.equal(false, Thule.Func.isPresent(undefined));
    });
    
    it('[] should not be present', function(){
      assert.equal(false, Thule.Func.isPresent([]));
    });
    
    it('[1] should be present', function(){
      assert.equal(true, Thule.Func.isPresent([1]));
    });
    
    it('new Array() should not be present', function(){
      assert.equal(false, Thule.Func.isPresent(new Array()));
    });
    
    it('{} should not be present', function(){
      assert.equal(false, Thule.Func.isPresent({}));
    });
    
    it('{a: 1} should be present', function(){
      assert.equal(true, Thule.Func.isPresent({a: 1}));
    });
    
    it('new Object() should not be present', function(){
      assert.equal(false, Thule.Func.isPresent(new Object()));
    });

    it('function(){} should be present', function(){
      assert.equal(true, Thule.Func.isPresent(function(){}));
    });

  });

  describe('#isBlank()', function(){
    
    it('true should be blank', function(){
      assert.equal(false, Thule.Func.isBlank(true));
    });
    
    it('false should not be blank', function(){
      assert.equal(true, Thule.Func.isBlank(false));
    });
    
    it('null should not be blank', function(){
      assert.equal(true, Thule.Func.isBlank(null));
    });
    
    it('undefined should not be blank', function(){
      assert.equal(true, Thule.Func.isBlank(undefined));
    });
    
    it('[] should not be blank', function(){
      assert.equal(true, Thule.Func.isBlank([]));
    });
    
    it('[1] should be blank', function(){
      assert.equal(false, Thule.Func.isBlank([1]));
    });
    
    it('new Array() should not be blank', function(){
      assert.equal(true, Thule.Func.isBlank(new Array()));
    });
    
    it('{} should not be blank', function(){
      assert.equal(true, Thule.Func.isBlank({}));
    });
    
    it('{a: 1} should be blank', function(){
      assert.equal(false, Thule.Func.isBlank({a: 1}));
    });
    
    it('new Object() should not be blank', function(){
      assert.equal(true, Thule.Func.isBlank(new Object()));
    });

    it('function(){} should be blank', function(){
      assert.equal(false, Thule.Func.isBlank(function(){}));
    });
  });

  describe('#allTrue()', function(){
    it("should be all true", function(){
      assert.equal(true, Thule.Func.allTrue([true, true, true, true]));
    });

    it("should be false", function(){
      assert.equal(false, Thule.Func.allTrue([true, true, true, false]));
    });
  });

  describe('#parsePath()', function(){
    it(' "/url/path" should be "/url/path/" ', function(){
      var path = "/url/path/";
      assert.equal(path, Thule.Func.parsePath("/url/path"));
    });

    it(' "url/path/" should be "/url/path/" ', function(){
      var path = "/url/path/";
      assert.equal(path, Thule.Func.parsePath("url/path/"));
    });

    it(' "url/path" should be "/url/path/" ', function(){
      var path = "/url/path/";
      assert.equal(path, Thule.Func.parsePath("url/path"));
    });

    it(' null should be "/" ', function(){
      assert.equal("/", Thule.Func.parsePath(null));
    });
  });

  describe('#diff()', function(){
    it('should be difference [1,2]" ', function(){
      var list = Thule.Func.diff([1,2,3,4,5], [3,4,5]);
      assert.equal(list[0], 1);
      assert.equal(list[1], 2);
      assert.equal(2, list.length);
    });
  });
});
