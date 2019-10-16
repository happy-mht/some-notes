## `koa`

`koa-static` 默认不会压缩，压缩需要加上 `gzip:true`参数，但是文件得是`.zp`结尾才行

> `gzip` Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with .gz extension exists. defaults to true.

所以一般使用 `koa-static-cache`，默认开启`gzip`压缩。



可以用使用颜色打印日志