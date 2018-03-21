# HTTP 状态码

## 1XX 信息性状态码 接收的请求正在处理

- 100 Continue

- 101 Switching Protocols 

      对首部字段附有 `Upgrade` 的请求 ( `Connection: Upgrade` )
 
## 2XX  成功状态码 请求正常处理完毕

- 200 （成功）服务器已经成功处理了请求
- 201 （已创建） 请求成功并且服务器已经创建了新的资源
- 202 （已接受） 服务器接受了请求但尚未处理
- 204 （无内容）No Content 

      请求处理成功，但没有资源返回。
  
      一般在只需要客户端往服务器发送信息，而对客户端不需要发送新信息内容的情况下使用。

- 206 Partial Content 

      是对资源某一部分的请求

      相应报文中包含由 Content-Range 指定范围的实体内容。

## 3XX 重定向 需要进行附加操作以完成请求

- 301 Moved Permanently

      永久重定向

      请求的资源已被重新分配了新的URI，以后应使用资源现在所指的URI

- 302 Found

      临时性重定向

      请求的资源已被重新分配了新的URI，希望用户**本次**使用现在所指的URI

- 303 See Other

      表示请求对应的资源存在着另一个URI，应使用GET方法定向获取请求的资源

- 304 Not Modified （和重定向没有关系）

      资源已经找到，但未符合条件请求

      表示客户端发送附带条件的请求时（If-Match、If-Modified-Since、If-None-Match、If-Range、If-Unmodified-Since），服务器允许请求访问资源，但是因请求未满足条件，直接返回 304 Not Modified（服务器资源未改变，可直接使用客户端未过期的缓存）

- 307 Temporary Redirect 

      临时重定向

      307 会遵照浏览器标准，不会从POST变成GET

## 4XX 客户端错误 服务器无法处理请求

- 400 Bad Request 

      请求报文存在语法错误

- 401 Unauthorized

      表示请求需要通过HTTP认证，或者用户认证失败

- 403 Forbidden

      不允许范围资源（未授权）

- 404 Not Found

      服务器没有请求的资源

## 5XX 服务器错误 服务器处理请求出错

- 500 Internal Server Error 

      服务器执行请求时发生错误
- 502 Bad Gateway

      对用户访问请求的响应超时造成的
- 503 Service Unavailable

      服务器暂时处于超负载或正在停机维护，无法处理请求

- 504 Gateway Timeout

      若代理无法连通源服务器再次获取资源，缓存必须给客户端一条 504 的状态码
