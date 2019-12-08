---
layout: post
title: "Swift Server Side - Kitura (6) Router"
date: 2019-12-07 19:00:00 +0800
permalink: "swift/kitura_6"
tags: [Swift, ServerSide, Kitura, Router]
categories: Swift
---

`Swift` `Kitura` `Server Side` `IBM` `Router`

上一篇我們講了 Middleware

這篇我們來講講 Router

```

`Router` provides the external interface for routing requests to
the appropriate code to handle them. This includes:

  - Routing requests to closures of type `RouterHandler`
  - Routing requests to the handle function of classes that implement the
   `RouterMiddleware` protocol.
  - Routing requests to a `TemplateEngine` to generate the appropriate output.
  - Serving the landing page when someone makes an HTTP request with a path of slash (/).

```

Router 就是處理所有 endPoint

建立起來很簡單
``` swift

  // if using kitura init, init project, you can find router in Application.swift
  let router = Router()

```

支援 `GET` / `POST` / `DELETE` / `PATCH` / `PUT`

宣告起來也很簡單，以下以 GET 為例
``` swift

  router.get("/") { req, res, next in 
    // do you want to do
  }

```
##### <br>
### SubRouter

簡單說明一下

假如我們有一個 EndPoint 是 GET https://yourDomain/api/123

不使用 SubRouter 時會寫成這樣

``` swift

  router.get("/api/123") { req, res, next in 
      // do you want to do
  }

```

使用 SubRouter 就會變成下面這樣

``` swift

    let apiRouter = Router()
    
    router.all("/api", middleware: apiRouter)

    apiRouter.get("/123") { req, res, next in 
      // do you want to do
  }

```

看起來好像寫的更多了，但是試想 我們可以把所有 `/api` 的 Request 放到裡外一個檔案去宣告

把不同段的邏輯分開來擺放

易於維護，易於調整


##### <br>
### Middleware

上一篇說了 Middleware 是用來放在中介層

這裡要來寫一下如何使用 Middleware

以下是一個把 Middleware 放在 SubRouter 前面的範例

``` swift

    let apiRouter = Router()

    router.all("/api", middleware: [VersionMiddleware(),
                                    apiRouter])

```

這樣所有 `/api` 之下 request 都會經過 VersionMiddleware 處理

下一篇再來說明 如果遇到 api 進來 是沒有宣告的要怎樣處理

<br>
#### Kitura 列表
#### <a href="/swift/kitura_1" target="_blank">Swift Server Side - Kitura (1) Install</a>
#### <a href="/swift/kitura_2" target="_blank">Swift Server Side - Kitura (2) SPM</a>
#### <a href="/swift/kitura_3" target="_blank">Swift Server Side - Kitura (3) Connect MySQL Server</a>
#### <a href="/swift/kitura_4" target="_blank">Swift Server Side - Kitura (4) MySQL 坑</a>
#### <a href="/swift/kitura_5" target="_blank">Swift Server Side - Kitura (5) Middleware</a>
<br>