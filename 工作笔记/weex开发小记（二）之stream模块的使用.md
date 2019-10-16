### stream

一个小小的stream模块，因为和web使用的ajax方法不同，为了搞清楚各种情况，我还是和后端同事一起折腾了一天才把各种请求错误分清 -_-. 

在weex中使用stream实现网络请求

API `fetch(options, callback[, progressCallback])`

在这个项目中统一使用个人封装的fetch模块发送请求。其中也有不少坑，主要注意一下：

1. 这个`progressCallback` 其实就相当于ajax对象中的 `onreadyStatusChange` 方法，只要`readyState`变了就会执行一次。而且执行时机web和安卓表现不同。发现这个问题主要是因为在登录时我为了防止用户重复点击登录按钮，所以在服务器还没有返回请求时，用户不同再点击登录。我刚开始是写在 `fetch`方法的第二个回调函数中，但是发现在安卓中根本不起作用，然后我在weex中使用debug模式好好查看了一番函数的执行时机及返回的数据，发现在playground中 `readyState`不会出现 3 的情况，就算加了判断web和安卓的表现总会出现不同的bug。。。。最后得出结论防止发送重复请求的锁不适合写在这个函数中。其实只要写在`fetch`方法的第一个回调函数中就可以了，这里的代码块一定是在请求返回时才执行的！！！刚开始还真实有点蠢。。
2. 安卓发送的异步请求不是 Ajax 请求，和 Web中的方式不同，所以在后台解析的时候可能有地方需要区分。由于新开发的项目后台代码沿用的是以前的PC端的项目，所以在判断用户状态（登录、离线、被挤下线）和请求报错的原因时就分不清楚了。

主要是在`weex`中发送`fetch`请求时，会先经过native内置的`stream`模块，并由`stream`模块向服务器发送请求。所以在请求期间可能`stream`模块还没有向服务器发出请求就返回了，此时的`status`为` -1`。（具体什么时候返回`-1`真的需要看看`stream`模块的源码，否则实在有点懵。）

有必要贴一下`stream`源码

```java
 /**
   *
   * @param optionsStr request options include:
   *  method: GET 、POST、PUT、DELETE、HEAD、PATCH
   *  headers：object，请求header
   *  url:
   *  body: "Any body that you want to add to your request"
   *  type: json、text、jsonp（native实现时等价与json）
   * @param callback finished callback,response object:
   *  status：status code
   *  ok：boolean 是否成功，等价于status200～299
   *  statusText：状态消息，用于定位具体错误原因
   *  data: 响应数据，当请求option中type为json，时data为object，否则data为string类型
   *  headers: object 响应头
   *
   * @param progressCallback in progress callback,for download progress and request state,response object:
   *  readyState: number 请求状态，1 OPENED，开始连接；2 HEADERS_RECEIVED；3 LOADING
   *  status：status code
   *  length：当前获取的字节数，总长度从headers里「Content-Length」获取
   *  statusText：状态消息，用于定位具体错误原因
   *  headers: object 响应头
   */
  @JSMethod(uiThread = false)
  public void fetch(String optionsStr, final JSCallback callback, JSCallback progressCallback){

    JSONObject optionsObj = null;
    try {
      optionsObj = JSON.parseObject(optionsStr);
    }catch (JSONException e){
      WXLogUtils.e("", e);
    }

    boolean invaildOption = optionsObj==null || optionsObj.getString("url")==null;
    if(invaildOption){
      if(callback != null) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("ok", false);
        resp.put(STATUS_TEXT, Status.ERR_INVALID_REQUEST);
        callback.invoke(resp);
      }
      return;
    }
    String method = optionsObj.getString("method");
    String url = optionsObj.getString("url");
    JSONObject headers = optionsObj.getJSONObject("headers");
    String body = optionsObj.getString("body");
    String type = optionsObj.getString("type");
    int timeout = optionsObj.getIntValue("timeout");

    if (method != null) method = method.toUpperCase();
    Options.Builder builder = new Options.Builder()
            .setMethod(!"GET".equals(method)
                    &&!"POST".equals(method)
                    &&!"PUT".equals(method)
                    &&!"DELETE".equals(method)
                    &&!"HEAD".equals(method)
                    &&!"PATCH".equals(method)?"GET":method)
            .setUrl(url)
            .setBody(body)
            .setType(type)
            .setTimeout(timeout);

    extractHeaders(headers,builder);
    final Options options = builder.createOptions();
    sendRequest(options, new ResponseCallback() {
      @Override
      public void onResponse(WXResponse response, Map<String, String> headers) {
        if(callback != null) {
          Map<String, Object> resp = new HashMap<>();
          if(response == null|| "-1".equals(response.statusCode)){
            resp.put(STATUS,-1);
            resp.put(STATUS_TEXT,Status.ERR_CONNECT_FAILED);
          }else {
            int code = Integer.parseInt(response.statusCode);
            resp.put(STATUS, code);
            resp.put("ok", (code >= 200 && code <= 299));
            if (response.originalData == null) {
              resp.put("data", null);
            } else {
              String respData = readAsString(response.originalData,
                      headers != null ? getHeader(headers, "Content-Type") : ""
              );
              try {
                resp.put("data", parseData(respData, options.getType()));
              } catch (JSONException exception) {
                WXLogUtils.e("", exception);
                resp.put("ok", false);
                resp.put("data","{'err':'Data parse failed!'}");
              }
            }
            resp.put(STATUS_TEXT, Status.getStatusText(response.statusCode));
          }
          resp.put("headers", headers);
          callback.invoke(resp);
        }
      }
    }, progressCallback);
  }
```

从源码中 ` if(response == null|| "-1".equals(response.statusCode)){
            resp.put(STATUS,-1);` 可以看到服务器没有数据响应时 `status = -1`（服务器本身返回-1的状态在我们这个项目中不会出现的。）

而什么时候服务器会没有响应呢？？

	亲测：

1. 请求超时，在weex中`timeout`默认是3000ms， 弱在`timeout`限制的时间内服务器还没有返回，则`status = -1` 。此时运行程序时，在日志中也可以看到原因。

2. 在用户登录失效时，第一次请求时服务器返回 500, 这主要由后端服务使用**shiro** 框架决定的。此时就难判断了，因为500可能是由于 内部服务器由于其他原因报错造成的。这个如果是在浏览器中可能就不难判断了。听后端同事的意思，可能是由于web发的是ajax请求，而安卓不是。。。

   解决办法：我在安卓端发送请求时带上一个`{"platform": "RF"}`的请求头，而服务器在用户登录过期时返回一个 `{"data": "{\"code\": 90001, \"msg\":\"请重新登录"}}"`的数据提示，此时只要判断 `data.code == 90001` 就不会和其它错误混淆


区分请求报错其它的情况

1. 登录还有一个问题，就是被挤下线的情况，但此时返回的状态码是 200 , 不过**shiro** 框架会在请求地址后面自动加上一个 `?kickout =1` 。在安卓中可以根据`ret.headers.Location.includes('kickout')` 判断用户是否被挤线了。。
2. 当`ret.status == 200 && !ret.ok`的情况，从上面的源码中看出`parseData(respData, options.getType())`当stream不能解析服务器返回的数据时会出现此种情况，在我司项目中要由于登录过期时，服务器会返回登录页（因为以前PC端的项目是前后端不分离的！！！）。
3. 当`ret.ok && ret.data == null` 时，其实经过上面的层层判断，在项目中我已经没有遇到过这种情况了，为了以防万一这总情况我还是 `reject(error)`(在`fetch`模块中返回的是一个`Promise`对象)

4. 剩下除了 `4XX` 的情况，就可以统一提示用户是内部服务器报错了（此时应该就是后端工程中出现了bug）.