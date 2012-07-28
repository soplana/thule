Thule.Event = {
  click : function(target, func){
    $(target).click( function(){func(new ThuleBase(), this)} );
  }
}
