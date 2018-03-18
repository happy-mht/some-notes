# HTTP报文首部

HTTP请求报文：请求行（方法、URI、HTTP版本）、HTTP首部字段（请求首部、通用首部、实体首部）

HTTP响应报文：状态行（HTTP版本、状态码-数字和原因短语）、HTTP首部字段（响应首部、通用首部、实体首部）

## 一、通用首部字段

1. `Cache-Control` 常用指令

`no-cache`：防止从缓存中返回过期的资源。

`max-age`：`HTTP/1.1` 版本的缓存服务器遇到同时存在 `Expires` 首部字段的情况时，优先处理`max-age`字段。而`HTTP/1.0` 版本相反。

2. `Connection`

    作用：
    1. 控制不再转发给代理的首部字段 `Connection: 不再转发的首部字段名`
    2. 管理持久连接 `Connection: close`：断开连接；`Connection: keep-alive`

3. `Upgrade` 升级为其他协议

在使用websocket时，需要加上此字段

`Upgrade: websocket`

`Connection: Upgrade`

## 二、请求首部字段

用于补充请求的附加信息、客户端信息、对响应内容相关的优先级等内容

1. Accept：通知服务器，用户代理能够处理的媒体类型及媒体类型的相对优先级. `type/subtype` 形式

`Accept: text/html; q=0.3, application/xhtml+xml`

媒体类型：

- 文本文件

      text/html，text/plain，text/css ...

      application/xhtml+xml, application/xml ...
- 图片文件

      image/jpeg，image/gif，image/png ...
- 视频文件

      video/mpeg, video/quicktime

- 应用程序使用的二进制文件

      application/octet-stream, application/zip

2. `Accept-Charset`  字符集

3. `Accept-Encoding` 编码 `gzip、compress、deflate、identity`
4. `Accept-Language`

5. `Authorization`

6. `If-XXX` 条件请求

- `If-Match` 与 资源的`Etag`值进行比较，不匹配时返回 `412 Precondition Failed`

- `If-Modified-Since` 与 `Last-Modified`比较

7. User-Agent

## 三、响应首部字段

1. Accept-Ranges
2. Age
3. ETag：告诉客户端实体标识
4. Location：将响应接收方引导至某个与请求URI位置不同的资源。

        基本上，该字段会配合 3XX：Redirection 的响应  

## 四、实体首部字段

1. Expires 将资源失效的日期告诉客户端
2. Last-Modified 资源最后修改的时间

## 五、为Cookie服务的首部字段

响应首部字段： Set-Cookie

请求首部字段：Cookie