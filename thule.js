/**************************************************
* Thule Javascript Library v0.0.1
* Copyright 2011-2012, Leeno
* 
* MIT Licence
**************************************************/
Thule = {};

Thule.RequireData = function(files, rules){
  this.appendFiles   = {};
  this.requiredFiles = [];
  this.rules         = rules || [];
  this.files         = files;
  this.isRunning     = null;

  files.forEach(function(file){
    this.appendFiles[file] = false;
  }, this);
};

Thule.RequireData.prototype = {
  require : function(){
    if( this.isRunning != null ) return null;
    
    this.start();
    var sync = new Thule.Sync();
    var self = this;

    this.files.forEach(function(file){
      sync.next(function(_sync){
        var script  = document.createElement('script');
        script.type = 'text/javascript';
        script.src  = file;
        script.onload = function(){
          self.appendFiles[file] = true;
          self.requiredFiles.push(file);
          _sync.finish();
        };
        document.body.appendChild(script);
      });
    }, this);
  },

  flags : function(){
    var flags = [];
    this.files.forEach(function(file){
      flags.push(this.appendFiles[file]);
    }, this);
    return flags;
  },

  start : function(){
    this.isRunning = true;
  },

  end : function(){
    this.isRunning = false;
  }
};

Thule.RequireFile = function(){
  this.requireDataList = [];
};

Thule.RequireFile.prototype = {
  set : function(files, rules){
    var _requiredFiles = [];
    this.requireDataList.forEach(function(requireData){
      _requiredFiles = _requiredFiles.concat(requireData.requiredFiles);
    });
    this.requireDataList.push( 
      new Thule.RequireData(Thule.Func.diff(files, _requiredFiles), rules)
    );
  },

  require : function(){
    var sync = new Thule.Sync();
  
    this.requireDataList.forEach(function(data){
      if( Thule.Func.allTrue(data.flags()) ) return null; 
      sync.next(function(){
        data.require();

      }, function(_sync){
        if( Thule.Func.allTrue(data.flags()) ){
          data.rules.forEach(function(rule){ Thule.Rule[rule]() });
          data.end();
          _sync.finish();
        }
      });
    });
  }

};

ThuleBase = function(options){
  var self = arguments.callee;
  if(Thule.Func.isPresent(self.instance)) return self.instance;

  var files = [];
  var path  = Thule.Func.parsePath(options.path);
  
  files.push(path + 'thule/ie_support.js');
  files.push(path + 'thule/event.js');
  files.push(path + 'thule/controller/app.js');
  if(Thule.Func.isPresent(options.controller))
    files.push(path + 'thule/controller/' + options.controller + '.js');
  files.push(path + 'thule/rule.js');
 
  this.initialize();
  this.setProperty({
    files: files, 
    path:  path, 
    rules: options.rule
  });
  return (self.instance = this);
};

ThuleBase.prototype = {
  initialize : function(){
    this.requireFile = new Thule.RequireFile();
    this.prefixPath  = null;
    this.rules       = null;
    this.sync        = null;
  },

  setProperty : function(property){
    if(property.path != null)  this.prefixPath = property.path;
    if(property.rules != null) this.rules      = property.rules;
   
    this.requireFile.set(property.files, property.rules);
    return this;
  },

  attach : function(){
    this.requireFile.require();
    return this;
  },

  append : function(options){
    var path   = Thule.Func.isPresent(options.path) ? Thule.Func.parsePath(options.path) : this.prefixPath;
    var files  = [];
    if(Thule.Func.isPresent(options.controller))
      files.push(path + 'thule/controller/' + options.controller + '.js');
    this.rules = null;
    
    this.setProperty({
      files: files, 
      path:  path, 
      rules: options.rule
    });
    return this;
  },

  run : function(_rules){
    this.rules =  _rules || this.rules;
   
    console.log(this.rules)
    if( this.rules.every(function(rule){
          if(!!Thule.Rule && Thule.Func.isPresent(Thule.Rule[rule])) return true
        }) ){
      this.rules.forEach(function(rule){
        Thule.Rule[rule]();
      });
      return this;
    };
    
    this.attach();
    return this;
  }
};

Thule.Func = {
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
    return !Thule.Func.isPresent(object);
  },

  allTrue : function(list){
    return (list || []).every(function(i){return i})
  },

  parsePath : function(path){
    if(Thule.Func.isBlank(path)) return '/';
    if(Thule.Func.isBlank(path.match(/^\//))) path = '/'+path; 
    if(Thule.Func.isBlank(path.match(/\/$/))) path = path+'/'; 
    return path;
  },

  diff : function(mainList, diffList){
    var list = (mainList || []).map(function(line){
      if(!diffList.some(function(d){return d==line})) return line;
    });
    var compactList = [];
    list.forEach(function(i){if(Thule.Func.isPresent(i)) compactList.push(i)});
    return compactList;
  }
};

Thule.Controller = {};
Thule.Model = {};

Thule.bind = function(thuleEvent, trigger, userEvent){
  function parseEvent(event){
    var events = event.split('/');
    var str    = Array.prototype.slice.call(events[0]);
    str[0]     = str[0].toUpperCase();
    return {
      controller : str.join(''),
      action     : events[1]
    };
  };

  var events = parseEvent(userEvent);
  var event = null;

  if(Thule.Func.isPresent(Thule.Controller[events.controller]))
    event  = Thule.Controller[events.controller][events.action];
  if(Thule.Func.isBlank(event)) return null;
  
  if(thuleEvent == 'load') event(new ThuleBase());
  else Thule.Event[thuleEvent](trigger, event);
};


Thule.SyncData = function(func, triggerEvent){
  this.func         = func;
  this.triggerEvent = Thule.Func.isPresent(triggerEvent) ? triggerEvent : null;
  this.isFinished   = false;
  this.isRunning    = null;
}

Thule.SyncQueue = function(){
  this.queue = [];
  this.runningQueue = null;
};

Thule.SyncQueue.prototype = {
  push : function(func, triggerEvent){
    this.queue.push(new Thule.SyncData(func, triggerEvent));
  },

  call : function(){
    var queueData = this.queue.filter(function(_queueData){
      if(_queueData.isFinished == false) return _queueData;
    })[0];
    if(Thule.Func.isBlank(queueData)) return false;

    if(queueData.isRunning == null){
      queueData.isRunning = true;
      this.runningQueue   = queueData;
      queueData.func(this);
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

Thule.Sync = function(){
  this.queue    = new Thule.SyncQueue();
  this.interval = null;
};

Thule.Sync.prototype = {
  next : function(func, triggerEvent){
    this.queue.push(func, triggerEvent);
    this.run();
    return this;
  },

  run : function(){
    if(this.interval != null) return null;
    
    var self = this;
    this.interval = setInterval(function(){
      console.log("hoge");
      if(!self.queue.call()){
        console.log("ugougo");
        clearInterval(self.interval); 
        self.queue = new Thule.SyncQueue();
      };
    }, 100);
  }
};
