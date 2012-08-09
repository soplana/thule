/**************************************************
* thule.js v0.0.2
**************************************************/
Thule = {};
$tl   = Thule;





//***********************************************
// Thule main class
//***********************************************
$tl.App = $class({
  initialize : function(options){
    this.options = this.createDefaultOptions(options);
    this.requireCompletionFlag = false;
  },

  public : {
    run : function(){
      this.loadScriptFile();
      this.runRule();
      return this;
    },

    append : function(options){
      //this.options = this.addDefaultOptions(options);
      //this.loadScriptFile();
      //this.runRule();
      return this;
    }
  },

  private : {
    runRule : function(){
      var self = this;
      var interval = setInterval(function(){
        if( self.requireCompletionFlag ){
          clearInterval(interval); 
          self.fire();
        };
      }, 100);
    },

    fire : function(){
      this.options.rule.forEach(function(rule){
        $tl.Rule[rule].call(this);
      }, this);
    },

    bind : function(eventType, trigger, userEvent){
      var events = this.parseEvent(userEvent);
      var event  = null;

      if($tl.Support.isPresent($tl.Controller[events.controller]))
        event = $tl.Controller[events.controller][events.action];
      if($tl.Support.isBlank(event))
        return null;

      if(eventType === 'load') 
        event(this);
      else
        $tl.Event[eventType](trigger, event);
    },

    createDefaultOptions : function(options){
      var _options        = {};
      _options.path       = options.path       || '/';
      _options.rule       = options.rule       || [];
      _options.controller = options.controller || [];
      return _options;
    },

    loadScriptFile : function(){
      var prefixPath  = this.parsePath();
      var files = [
        prefixPath + 'thule/ie_support.js',
        prefixPath + 'thule/controller/app.js'
      ];

      this.options.controller.forEach(function(controller){
        files.push( prefixPath + 'thule/controller/' + controller + '.js');
      });
      files.push(prefixPath + 'thule/rule.js');

      this.syncLoad(files);
    },

    syncLoad : function(files){
      var sync = new $tl.Sync();
      files.forEach(function(file){
        sync.next(function(_sync){
          $.ajax({
            url : file,
            dataType: "script",
            success : function(){_sync.finish()}
          });
        });
      });

      sync.next(function(__sync){
        this.requireCompletionFlag = true;
        __sync.finish();
      }, null, this);
    },

    parsePath : function(path){
      var path = this.options.path;
      if($tl.Support.isBlank(path)) return '/';
      if($tl.Support.isBlank(path.match(/^\//))) path = '/'+path; 
      if($tl.Support.isBlank(path.match(/\/$/))) path = path+'/'; 
      return path;
    },

    parseEvent : function(event){
      var events = event.split('/');
      var str    = Array.prototype.slice.call(events[0]);
      str[0]     = str[0].toUpperCase();
      return {
        controller : str.join(''),
        action     : events[1]
      };
    },

    parseEvent : function(event){
      var events = event.split('/');
      var str    = Array.prototype.slice.call(events[0]);
      str[0]     = str[0].toUpperCase();
      return {
        controller : str.join(''),
        action     : events[1]
      };
    }
  }

});





//***********************************************
// thule Event
//***********************************************
$tl.Event = {
  click : function(target, func){
    $(target).click( function(){func(new ThuleBase(), this)} );
  }
};





//***********************************************
// Support methods
//***********************************************
$tl.Support = {
  isPresent : function(object){
    if(object instanceof Array){
      if(object.length == 0) return false;
      else return true;

    } else if(object instanceof Function) {
      return !!object;

    } else if(object instanceof Object) {
      var notEmpty = false;
      for(var i in object) notEmpty = true;
      return notEmpty;
    };
    return !!object;
  },

  isBlank : function(object){
    return !$tl.Support.isPresent(object);
  }
};





//***********************************************
// synchronization process 
//***********************************************
$tl.SyncData = function(func, triggerEvent){
  this.func         = func;
  this.triggerEvent = $tl.Support.isPresent(triggerEvent) ? triggerEvent : null;
  this.isFinished   = false;
  this.isRunning    = null;
}

$tl.SyncQueue = function(){
  this.queue = [];
  this.runningQueue = null;
};

$tl.SyncQueue.prototype = {
  push : function(func, triggerEvent){
    this.queue.push(new $tl.SyncData(func, triggerEvent));
  },

  call : function(self){
    var queueData = this.queue.filter(function(_queueData){
      if(_queueData.isFinished == false) return _queueData;
    })[0];
    if($tl.Support.isBlank(queueData)) return false;

    if(queueData.isRunning == null){
      queueData.isRunning = true;
      this.runningQueue   = queueData;
      queueData.func.call( (self || this), this);
    };

    if(queueData.triggerEvent != null) queueData.triggerEvent(this);

    return true;
  },

  get : function(index){
    return this.queue[index];
  },

  finish : function(){
    this.runningQueue.isFinished = true;
    this.runningQueue.isRunning  = false;
  }
};

$tl.Sync = function(){
  this.queue    = new $tl.SyncQueue();
  this.interval = null;
};

$tl.Sync.prototype = {
  next : function(func, triggerEvent, self){
    this.self = self;
    this.queue.push(func, triggerEvent);
    this.run();
    return this;
  },

  run : function(){
    if(this.interval != null) return null;
    
    var self = this;
    this.interval = setInterval(function(){
      console.log("hoge");
      if(!self.queue.call(self.self)){
        console.log("ugougo");
        clearInterval(self.interval); 
        self.queue = new $tl.SyncQueue();
      };
    }, 100);
  }
};
