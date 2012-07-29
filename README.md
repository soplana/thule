# Thule Javascript FrameWork Library

javascriptの "どの要素" に "どのイベントがハンドリング" されていて "どこに処理が書かれているか" をすっきりさせる事が目的のライブラリ


## install & use

### Ruby on Rails Examples

install

```
$ git clone https://github.com/soplana/thule.git 
$ cp -r thule/thule RAILS_HOME/app/assets/javascripts/
```

edit thule/controller/app.js

```javascript:controller/app.js
Thule.Controller.App = {
  // 処理内容はcontrollerに記述
  // ここに定義するfunctionをactionとする
  hello : function(){ alert("hellow thule") }
}
```

edit thule/rule.js

```javasciript:rule.js
Thule.Rule = {
  // 処理の単位を決めるrule
  // ページロードのタイミングでハンドリングしたいイベントを
  // ココにrule名を付けてまとめて、view側で呼び出したり
  index : function(){
    // 第一引数: イベント名
    // 第二引数: ターゲットとなるDOM
    // 第三引数: controller/action
    Thule.bind("click", "#hello_link", 'app/hello');
  }
}
```

edit viewfile

```html:app/views/root/index.html
<script src="/assets/jquery.js" type="text/javascript"></script>
<script src="/assets/thule/thule.js" type="text/javascript"></script>

<script type="text/javascript">
  $(document).ready(function(){
    // path : thule.jsが置いてあるパス
    // rule : rule.jsで定義したrule。複数指定可。
    // run()でイベントのハンドリング開始
    new ThuleBase({
      path : "/assets",
      rule : ["index"]
    }).run();
  });
</script>

<a href="javascript:void(0)" id="hello_link">hello</a>
```
