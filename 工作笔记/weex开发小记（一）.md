
使用weex开发一个来月了，前前后后踩了不少坑，特此记录，以免遗忘

#### 注意点

#### `css`

1. weex 中默认的设计尺寸是750px
   `<meta name="weex-viewport" content="750">`
   当真实屏幕不是750px时，weex会自动将设计尺寸映射到真实尺寸中去，即`scale` —— `scale = 当前屏幕尺寸 / 750`

   `dpi = dp = px` 会根据手机变化（相当于rem，是相对大小）

   所以在扩展组件的时候，如果用户传入一个尺寸值，比如说 375，这个值是相对于 750 的设计尺寸来说的。你只需要将这个值乘以 scale, 就是适配当前屏幕的真实尺寸：value = 375 * this.data.scale. 它应该占据真实屏幕一半的大小。

2. 样式需要使用class属性写，用id不支持，手机上可能显示不出来

3. 图片需要指定大小才能显示，在移动端可以使用'wx' 单位(相当于px)，不会转化为rem，移动端支持'px'.

4. iconfont 需要借助“dom”模块


```html
<text class="login-text" style='font-family:iconfont;font-size:24wx;left:2wx'>&#xe67d;</text>
```
```js
var domModule = weex.requireModule('dom');
domModule.addRule('fontFace', {
  'fontFamily': "iconfont",
  'src': "url('http://at.alicdn.com/t/font_733844_kb66bfef25.woff')"
});
```

5. `weex`默认的HTML根元素的`font-size = 屏幕的宽度/10 `
6. `weex`中不支持阴影，设置`box-shadow`不起作用。
7. 样式表和CSS规则是由weex.js框架和原生渲染引擎管理的，处于性能考虑，weex目前支持在、单个类选择器，并且只支持CSS规则的子集。
8. weex`支持线性渐变，不支持径向渐变`
9. `weex中的`box-shadow`仅仅支持IOS。 需要给容器的背景手动添加颜色，否则在IOS中背景颜色就是`box-shadow`的颜色。`
10. `weex`不支持媒体查询`
11. `image`组件设置`flex`为1后，就可以不用设置`width`和`height`，可以自适应屏幕尺寸.
12. 使用绝对定位，不一定和web页面的显示一样。在tab页面使用fixed定位时，web中，固定定位的元素是根据第一个tab页面的左边源。而在安卓中是根据屏幕的左侧。
13. 如果定位元素超过容器边界，在 Android 下，超出部分将不可见，原因在于 Android 端元素 overflow 默认值为 hidden，但目前 Android 暂不支持设置 overflow: visible。
14. fixed定位的元素z轴位置会比较高
15. position、transform：改变tab层的位置，此方法在定位为`position:fixed;` 的子元素上依然无效。
16. 在APP上 fixed层级最高，但是fixed容器不能滚动。。。。。。
17. 给style传多个字符串，在APP不能正确显示颜色，需要传递对象
18. 使用 border 实现的三角形，在 native 环境中是不起作用的，即使样式分开写了，也是不起作用，weex 环境中使用三角形，建议使用 svg。
19. input 组件设置disabled属性需要写成 `<input type="text" disabled="true">` 不能采用web中的简写方式。
20. weex安卓客户端不支持`css`的深度作用选择器, `>>>`操作符。即父组件中有`scoped` 修饰时不能修改子组件的样式。

#### `Weex` 页面跳转

> Weex 使用原生的navigator来管理页面实例，多个实例之间的状态是隔离的。也就是说，vuex和vue-router智能作用于当前一个页面，无法在多个页面间共享状态。

在项目中我也就没有使用 `vue-router`和 `vuex `. 使用自己写的`router.js `统一管理项目中的页面跳转。在页面传递简单的参数时，附加加URL后面，当需要在2个页面间传递复杂的对象时，暂时将2个页面合成一个tab页面实现页面跳转。

#### 安卓native

android APP 项目中本地资源文件读取是要使用file:///协议，安卓版本不同，配置可能不同。默认地址是`file:///android_asset`，所以在项目中的js引用图片时要使用此地址

在页面跳转时，可以不用直接使用`file:///pages/homeIndex.js`，不用加 `android_asset` 是因为在activity类中做了解析.   

android Studio 编译时提示 Error: Please select android sdk.
[解决方法](https://blog.csdn.net/CHITTY1993/article/details/78779125/)

#### 与Vue的不兼容点

1. v-bind:class可以普通class共存，但是v-bind:class只支持数组形式的语法，另外的两种形式对象和字符串都不支持
2. weex官网文档写着支持vue的<transition>标签，实际上并不支持

#### 显示和隐藏

1. `weex`的`display`只支持`flex`，所以无法设置`display: none`,  自然`vue`的`v-show`指令也不支持. 但是`vue`的`v-if`可以使用, 需要注意的是, `v-if`最好只用来做页面结构的控制, 而不要偷懒作为显示隐藏的手段。
     最佳实践：用`v-if`做页面结构控制，显示隐藏使用css的`visibility`属性来控制
       用`v-if`显示和隐藏单元素正常，但是对稍微复杂点的组件在显示的时候会出现抖动，解决方式参考写的另一篇文章解决组件用`v-if`显示时出现的抖动问题
2. weex不支持`overflow-x`和`overflow-y`, iOS下支持`overflow`，默认为visible；Android下`overflow`默认为`hidden`，且无法设置为`visible`。
3. opacity、visablity：此处需要注意，Weex的渲染机制和web是有区别的，对父层设置opacity或者visiablity隐藏是无法同时隐藏定位为`position:fixed;` 的子元素。
4. 当滚动页面中的容器是`list`，且包含`<input>`标签，则可能会出现手机软键盘已经隐藏，但是页面布局上移后没有恢复（下移）的情况，改为`scroller`标签没有这个问题。这个问题还与安卓版本有关，`android*5.1 API22`版本会有这个问题。

#### js

1. weex 中不支持Promise的finally方法，支持then和catch**

2. image组件的load方法在android下失效，且在android下圆角无法设置，安卓端可以自己写一个组件个weex使用

3. 组件中有input组件时，如果给input初始化一个值，且绑定一个onInput事件，则在安卓中会执行onInput函数。而在web中不会

4. `new Date(time)` `time` 在安卓中不能解析 `xxxx-xx-xx` 格式的时间参数，可以传 `20180101` 格式的
   但是在传 `20180101` 格式的时间时注意不能传字符串，需要转化为整型,且必须为是时间戳
   可以使用 `2018,1,1` 格式，注意不能为`2018,01,01`

5. 安卓上的时间可能不是按照东八区显示的，手机设置系统的时区后也不一定生效。转换时间时可以使用`momentJs`库来指定时区来显示。`moment(stamp).utcOffset(8).format("YYYY-MM-DD HH:mm:ss") `

   注意下面这个`zone()`方法已经被moment丢弃，改用`utcOffset`方法

   `moment(stamp).utc().zone(-8).format("YYYY-MM-DD HH:mm:ss") `

#### weex-nat 模块使用注意点

1. 由于项目中需要上传文件到服务器，所以用到weex-nat模块的transfer模块，但是此模块只支持一次上传一个文件。并且文件流的`name` 属性已经被写死为`file`

2. 调用weex-nat 的image和camera模块时，回调函数不自动执行。需要在相应的安卓项目的activity中重写`onActivityResult`方法。
```java
   /**
      * 为了执行WXModule扩展模块中定义的{@link com.taobao.weex.common.WXModule#onActivityResult(int, int, Intent)}
      * */
     @Override
     protected void onActivityResult(int requestCode, int resultCode,
                                     Intent data)
     {
         super.onActivityResult(requestCode, resultCode, data);
         if (mWXSDKInstance != null)
         {
             mWXSDKInstance.onActivityResult(requestCode, resultCode, data);
         }
     }
 }
```
