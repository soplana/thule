var assert = require("assert")
require("../thule/thule")


describe('Thule.SyncQueue', function(){
  describe('new Thule.SyncQueue()', function(){
    
    it('Property initial value should have been set correctly', function(){
      var queue = new Thule.SyncQueue();
      assert.equal(0, queue.queue.length);
      assert.equal(null, queue.runningQueue);
    });

  });

  describe('.push()', function(){
    
    it('Property should have been set correctly', function(){
      var queue = new Thule.SyncQueue();
      function func1(){return 1};
      function func2(){return 2};
      queue.push(func1);
      queue.push(func2);

      assert.equal(2, queue.queue.length);
      assert.equal(1, queue.queue[0].func());
      assert.equal(2, queue.queue[1].func());
    });

  });

  describe('.call()', function(){
    
    var queue       = null;
    var triggerFlag = false;

    before(function(){
      queue = new Thule.SyncQueue();
      function func1(){return 1};
      function func2(){return 2};
      function trigger(){triggerFlag=true};
      queue.push(func1, trigger);
      queue.push(func2);
      queue.call();
    });

    it('Processing status should be running', function(){
      assert.equal(true, queue.queue[0].isRunning);
      assert.equal(null, queue.queue[1].isRunning);
    });

    it('Queue should be stacked', function(){
      assert.equal("func1", queue.runningQueue.func.name);
    });

    it('Trigger Event should be ran', function(){
      assert.equal(true, triggerFlag);
    });

  });
});
