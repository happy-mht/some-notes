# css选择器类型、继承及其优先级

## css 选择器 https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference

### 基本选择器

- 元素选择器 elementName
- 类选择器 .classname
- ID选择器 #idname
- 通配选择器 *
- 属性选择器 [属性=值]

### 组合选择器

- 相邻兄弟选择器 A+B
- 普通兄弟选择器 A~B
- 子选择器 A>B
- 后代选择器 A B

### 伪类

    :active :first-of-all :link

### 伪元素

    ::after ::first-line ::first-letter

## 选择器优先级

以下选择器优先级是递增的：同权重情况下样式定义最近者为准;载入样式以最后载入的定位为准;

1. 类型选择器和伪元素
2. 类选择器，属性和伪类
3. ID选择器

通配符选择符（`*`），关系选择符（`+`,`>`,`~`,`x y`)和否定伪类(`:not()`)对优先级没有影响。但是在`:not()`内部声明的选择器是会影响优先级

### 内联样式总会覆盖外部样式表的任何样式

### `!important` 声明会覆盖其它任何声明

### 为目标元素直接添加样式，永远比继承样式的优先级高，无视优先级的遗传规则。

```html
<style>
    #app .inner {
        color: red;
    }

    .inner {
        color: blue;
    }

    .yellow {
        color: yellow;
    }
</style>
 <div id="app">
    <div class="inner">
        <span class="yellow">this is yellow</span> this is  red
    </div>
</div>
```

### 无视DOM树中的距离

```html
<html>
<style>
  body h1 {
    color: green;
  }
  html h1 {
    color: purple;
  }
</style>
<body>
  <h1>Here is purple!</h1>
</body>
</html>
```

## CSS继承

### 不可继承的：

会造成重排的属性均不可以继承

```css
display                  |                  position
margin                   |                  left
border                   |                  right
padding                  |                  top
background               |                  bottom
height                   |                  z-index
min-height               |                  float
max-height               |                  clear
width                    |                  table-layout
min-width                |                  vertical-align
max-width                |                  page-break-after
overflow                 |                  page-bread-before
unicode-bidi             |
```

### 所有元素可继承

`visibility, cursor`

### 内联元素可以继承

```css
letter-spacing
word-spacing
white-space
line-height
color
font
font-family
font-size
font-style
font-variant
font-weight
text-decoration
text-transform
direction
```

### 块状元素可继承

`text-indent, text-align`

### 列表元素可以继承

```css
list-style
list-style-type
list-style-position
list-style-image
```

### 控制继承

CSS为处理继承提供了三种特殊的通用属性值：

- `inherit`：该值将应用到选定元素的属性值设置为与其父元素一样（继承）

- `initial`：初始值（浏览器默认样式）

- `unset`：如果有继承父级样式，则将该属性重新设置为继承的值，如果没有继承父级样式，则将该属性重新设置为初始值。优先用inherit的样式，其次会应该用initial的样式。
