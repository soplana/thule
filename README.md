# Thule Javascript Library

Javascript EventとDOMを紐付けるためのライブラリー
Event処理を記述するcotrollerと、そのEventとDOMの関連性を示すruleを記述して使う。


## install & use

### Ruby on Rails Examples

install

```
$ git clone https://github.com/soplana/thule.git
$ cp -r thule/thule RAILS_HOME/app/assets/javascripts/
```

thule/controller/app.jsにEvent functionを追加

```javascript:controller/app.js
Thule.Controller.App = {
  // 処理内容はcontrollerに記述
  // ここに定義するfunctionをactionとする
  hello : function(){ alert("hello thule") }
}
```

thule/rule.jsに、イベントタイプとDOM要素と処理（controller/action）の関係を記述

```javasciript:rule.js
Thule.Rule = {
  // 処理の単位を決めるrule
  // ページロードのタイミングでハンドリングしたいイベントを
  // ココに任意のrule名を付けてまとめて、viewなどから呼び出す
  index : function(){
    // 第一引数: イベント名
    // 第二引数: ターゲットとなるDOM
    // 第三引数: controller名/action名
    Thule.bind("click", "#hello_link", 'app/hello');
  }
}
```

viewで呼び出し

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

## controllerを作る

thule/controller/以下に任意の名前でcontrollerを作成

```
$ touch app/assets/javascripts/thule/controller/user.js
```

Thule.Controllerに、作成したcontrollerファイル名の頭文字を大文字にしたオブジェクトを追加

作成したオブジェクトの中にapp.jsと同様actionを作成

```javascript:
Thule.Controller.User = {
  sign_up_click : function(){ alert("sign up") }
}
```

rule.jsに作成したcontroller/actionを追記

```
Thule.Rule = {
  index : function(){
    Thule.bind("click", "#hello_link", 'app/hello');
    Thule.bind("click", "#sign_up_link", 'user/sign_up_click');
  }
}
```

view側で呼び出し

newする際の引数に、作成したcontrollerを指定

```html:app/views/root/index.html
<script src="/assets/jquery.js" type="text/javascript"></script>
<script src="/assets/thule/thule.js" type="text/javascript"></script>

<script type="text/javascript">
  $(document).ready(function(){
    new ThuleBase({
      path : "/assets",
      controller : "user",
      rule : ["index"]
    }).run();
  });
</script>

<a href="javascript:void(0)" id="hello_link">hello</a>
<a href="javascript:void(0)" id="sign_up_link"> sign up</a>
```
