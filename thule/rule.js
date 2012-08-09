$tl.Rule = {
  /**************************************************
  * ------ Rule format -----------------------------
  * rule_name : function(){
  *   this.bind(event_type, element_name(jQuery selector), controller_name/action_name)
  * }
  *
  *
  * ------ event type -----------------------------
  * 'click' - onclick
  * 'load'  - onload
  *
  *
  * ------ sample code -----------------------------
  * articles : function(){
  *   this.bind('load', null, 'articles/showArticle'); //onload Event
  *   this.bind('click', '#article_title', 'articles/addArticleTitle'); //onclick Event
  * }
  *
  **************************************************/
}
