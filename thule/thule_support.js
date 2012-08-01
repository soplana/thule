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

so.object = function(){
  this.klass = null;
};
so.object.prototype = {
  make : function(_class){
    this.notRunConstructor = true; 
    this.klass             = _class; 
    this.methodStore       = new so.methodStore(_class);
    
    this.klass = this.constructor.apply(this);
    this.klass.new = so.object.new;
    this.notRunConstructor = false; 
    return this.klass;
  },

  constructor : function(){
    if(!this.notRunConstructor){
      console.log(this);
      var property = this.initialize(arguments); 
      this.attachProperty(property);
    }
    return arguments.callee;
  },

  attachProperty : function(property){
    for(var initPublicProperty in property.public)
      so.object.setPublicProperty.call(this.klass, initPublicProperty, property);  
    
    for(var prototypePublicProperty in this.methodStore.getPublic())
      so.object.setPublicProperty.call(this.klass, prototypePublicProperty, this.methodStore.methods);
  },

  initialize : function(args){
    var initialize = this.methodStore.initialize;
    var property   = {public : {}, private : {}}; 
    initialize.apply(property, args);
    return property;
  }
};

so.object.new = function(args){
  return new this(args);
};

so.object.setPublicProperty = function(_public, properties){
  var property = properties["public"][_public];

  if((typeof property) == "function"){
    this.__proto__[_public] = property;
  }else{
    this[_public] = property;
  }
};

so.makeClass = function(_class){
  var klass = new so.object().make(_class);
  return klass;
}
