在元素上绑定pan事件时，有event对象中有`changedTouches` 数组，里面存放着`TouchList`

```js
 //在浏览器中
changedTouches = [{
    clientX: 328,
    clientY: 84,
    force: 1,
    identifier: 0,
    pageX: 328,
    pageY: 84,
    radiusX: 11.5,
    radiusY: 11.5,
    rotationAngle: 0,
    screenX: 625,
    screenY: 231,
    target: {},
}]
// 在安卓中
changedTouches = [{"identifier":0,"pageX":535.59705,"pageY":84.64661,"screenX":532.8125,"screenY":239.0625}]
```

1. `screenX`:鼠标位置相对于用户屏幕水平偏移量，而`screenY`也就是垂直方向的，此时的参照点也就是原点是屏幕的左上角。
2. `clientX:` 跟screenX相比就是将参照点改成了浏览器内容区域的左上角，该参照点会随之滚动条的移动而移动。
3. `pageX`：参照点也是浏览器内容区域的左上角，但它不会随着滚动条而变动

在我们判断手势滑动了多少距离时，应该相对于内容区域计算，在浏览器中用 `clientX`很合适，但是在安卓中没有这个属性。为了兼容web和安卓，使用`pageX`

在安卓中list元素绑定`horizontalpan`无效，因为list默认支持垂直滚动，但是`horizontalpan`是水平滑动，会有冲突。

滑动切换tab页面（以下只针对安卓APP）

1. 需使用我改过后`weexTabPage`组件， 组件中主要监听 `horizontalpan`事件实现滑动切换
2. `list`组件不支持`horizontalpan`事件
3. `scroller` 组件支持 `horizontalpan`事件 （但是好像绑定了`loadmore`事件时就不支持了）。
4. 需要滑动切换功能的页面中将`list`都改为`scroller` 

注释： 

1. 不支持的原因应该是手势滑动方向的冲突。
2. 在使用时如果某个`tab`页面有滚动加载数据且**数据不为空**时，是不能滑动切换的！！！

在tab页面中使用`scroller`组件如果组件容器中的元素存在点击事件，手指放在这些元素上**可能**不会触发下拉事件（也可能和页面的布局有关），但是`list`组件可以。

使用`scroller` 时，注册了上拉加载和下拉刷新时间，当上拉时会新执行下拉刷新操作。。。。换成`list` 容器就不会有这个问题。