---
layout: post
title: "Swift Server Side - Kitura (5) Middleware"
date: 2019-12-07 13:30:00 +0800
permalink: "swift/kitura_5"
tags: [Swift, ServerSide, Kitura, Middleware]
categories: Swift
---

`Swift` `Kitura` `Server Side` `IBM` `Middleware`

先上張圖，解釋 API 打進來的流程
<br>
<figure>
<a><img src="{{site.url}}/asset/flow-001.png"></a>
</figure>

Middleware 以及 Router 的觀念被廣泛應用在不同平台的 Web Framework

可以將每個 request 都需要處理相同的事務的部分

使用 Middleware 處理

在 kitura，建立一個 Middleware 很簡單，只要 Confirm `RouterMiddleware` Protocol 就可以

``` swift

    struct TestMiddleware: RouterMiddleware {
        // implement RouterMiddleware
        func handle(request: RouterRequest,
                    response: RouterResponse,
                    next: @escaping () -> Void) throws {
            // can change request and response
            // when done call the next()
        }
    }

```

如果只是需要一個單次的 Middleware，可以使用 `RouterMiddlewareGenerator`
``` swift

    RouterMiddlewareGenerator { request, response, next in
        // do you want to do            
    }

```

至於 Router 下篇見

<br>
#### Kitura 列表
#### <a href="/swift/kitura_1" target="_blank">Swift Server Side - Kitura (1) Install</a>
#### <a href="/swift/kitura_2" target="_blank">Swift Server Side - Kitura (2) SPM</a>
#### <a href="/swift/kitura_3" target="_blank">Swift Server Side - Kitura (3) Connect MySQL Server</a>
#### <a href="/swift/kitura_4" target="_blank">Swift Server Side - Kitura (4) MySQL 坑</a>
<br>