var assert = require("assert")
require("../thule")


describe('Thule.SyncQueue', function(){
  describe('new Thule.SyncQueue()', function(){
    
    it('Property initial value should have been set correctly', function(){
      var queue = new Thule.SyncQueue();
      assert.equal(0, queue.queue.length);
      assert.equal(null, queue.runningQueue);
    });

  });

  describe('.push()', function(){
    
    it('Property initial value should have been set correctly', function(){
      var queue = new Thule.SyncQueue();
      assert.equal(0, queue.queue.length);
      assert.equal(null, queue.runningQueue);
    });

  });
});
