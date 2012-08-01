var ThuleSupport = {}

ThuleSupport.methodStore = function(_methods){
  this.methods = _methods;
  this.initialize = _methods.initialize || function(){};
};

ThuleSupport.methodStore.prototype = {
  getPublic : function(){
    return this.methods.public;
  }
};

ThuleSupport.Object = {
  methodStore : null,

  constructor : function(){
    var property = ThuleSupport.Object.initialize(arguments); 
    ThuleSupport.Object.attachProperty.call(this, property);
    ThuleSupport.Object.clear();
  },

  new : function(args){
    return new this(args);
  },

  make : function(_class){
    var newClass = ThuleSupport.Object.constructor;
    newClass.new = ThuleSupport.Object.new;
    ThuleSupport.Object.methodStore = new ThuleSupport.methodStore(_class);
    return newClass;
  },

  setPublicProperty : function(_public, properties){
    var property = properties["public"][_public];

    if((typeof property) == "function"){
      this.__proto__[_public] = property;
    }else{
      this[_public] = property;
    }
  },

  initialize : function(args){
    var initialize = ThuleSupport.Object.methodStore.initialize;
    var property   = {public : {}, private : {}}; 
    initialize.apply(property, args);
    return property;
  },

  attachProperty : function(property){
    for(var initPublicProperty in property.public)
      ThuleSupport.Object.setPublicProperty.call(this, initPublicProperty, property);  
    
    for(var prototypePublicProperty in ThuleSupport.Object.methodStore.getPublic())
      ThuleSupport.Object.setPublicProperty.call(this, prototypePublicProperty, ThuleSupport.Object.methodStore.methods);
  },

  clear : function(){
  }
};

var makeClass = ThuleSupport.Object.make;
