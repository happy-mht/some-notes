# CSS 实现三栏布局

1、使用float + margin

```html
<style>
  html,
  body {
      height: 100%;
  }
  
  div {
      border: 1px solid #ccc;
      height: 100%;
  }
  
  .left {
      float: left;
      width: 200px;
  }
  
  .right {
      float: right;
      width: 200px;
  }
  
  .main {
      margin: 0 200px;
  }
</style>
<body>
  <!-- 注意main放最后 -->
  <div class="left">my name is left</div>
  <div class="right">my name is right</div>
  <div class="main">my name is main</div>
</body>
```

2、flex 布局

```html
 <style>
    body {
        display: flex;
    }

    .left,
    .right {
        width: 200px;
    }
    .main {
        flex: 1;
    }
</style>
<body>
    <div class="left">
        my name is left
    </div>
    <div class="main">my name is main</div>
    <div class="right">my name is right</div>

</body>
```