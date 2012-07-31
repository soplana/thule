var ThuleObject = function(){
  thuleConstructor.call(this);
};

thuleConstructor = function(){
  var property = {public : {}, private : {}}; 
  this.__proto__.initialize.apply(property, arguments);

  function setPublicProperty(_public, properties){
    this.__proto__[_public] = properties["public"][_public];
  };

  for(var initPublicProperty in property.public)
    setPublicProperty.call(this, initPublicProperty, property);  
  
  for(var prototypePublicProperty in this.public)
    setPublicProperty.call(this, prototypePublicProperty, this.__proto__);
};

ThuleObject.new = function(args){
  return new this(args);
};

ThuleObject.newClass = function(object){
  var newClass = function(){ thuleConstructor.call(this) };
  newClass.new = ThuleObject.new;
  newClass.prototype.initialize = ThuleObject.prototype.initialize;
  return newClass;
};

ThuleObject.prototype = {
  initialize : function(){
    this.public.init = "soplana";
  },

  public : {
    hoge : function(){
      console.log(this.init);
    },
    
    fuga : function(){
      console.log("fuga");
    }
  }
};


var Obj = ThuleObject.newClass();
Obj.prototype = {
  public : {
    test : function(){
      console.log("unko");
    }
  }
}

console.log(Obj.new())//.test();

ThuleObject.new("a","b","3").hoge();
