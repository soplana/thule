Thule.Rule = {
  /**************************************************
  * ------ Rule format -----------------------------
  * rule_name : function(){
  *   Thule.bind(event_type, element_name(jQuery selector), controller_name/action_name)
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
  *   Thule.bind('load', null, 'articles/showArticle'); //onload Event
  *   Thule.bind('click', '#article_title', 'articles/addArticleTitle'); //onclick Event
  * }
  *
  **************************************************/
}
