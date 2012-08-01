var so = {}

so.methodStore = function(_methods){
  this.methods = _methods;
  this.initialize = _methods.initialize || function(){};
};

so.methodStore.prototype = {
  getPublic : function(){
    return this.methods.public;
  }
};

so.object = {
  methodStore : null,

  constructor : function(){
    var property = so.object.initialize(arguments); 
    so.object.attachProperty.call(this, property);
    so.object.clear();
  },

  new : function(args){
    return new this(args);
  },

  make : function(_class){
    var newClass = so.object.constructor;
    newClass.new = so.object.new;
    so.object.methodStore = new so.methodStore(_class);
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
    var initialize = so.object.methodStore.initialize;
    var property   = {public : {}, private : {}}; 
    initialize.apply(property, args);
    return property;
  },

  attachProperty : function(property){
    for(var initPublicProperty in property.public)
      so.object.setPublicProperty.call(this, initPublicProperty, property);  
    
    for(var prototypePublicProperty in so.object.methodStore.getPublic())
      so.object.setPublicProperty.call(this, prototypePublicProperty, so.object.methodStore.methods);
  },

  clear : function(){
  }
};

so.makeClass = so.object.make;
