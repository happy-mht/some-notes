margin-left: auto;为什么可以使的元素靠右?
```css
div {
  width: 100px;
  margin-left: auto;
}
```
常規流中的块級非置換元素[中文版规定](https://www.w3.org/html/ig/zh/wiki/CSS2/visudet#blockwidth)，[英文版规定](https://www.w3.org/TR/CSS22/visudet.html#blockwidth)
>The following constraints must hold among the used values of the other properties:

>'margin-left' + 'border-left-width' + 'padding-left' + 'width' + 'padding-right' +'border-right-width' + 'margin-right' = width of containing block

这个属于其中一种情况：
>If there is exactly one value specified as 'auto', its used value follows from the equality.
