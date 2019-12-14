---
layout: post
title: "Swift Server Side - Kitura (8) Codable Routing"
date: 2019-12-14 11:55:00 +0800
permalink: "swift/kitura_8"
tags: [Swift, ServerSide, Kitura, Codable Routing]
categories: Swift
---

`Swift` `Kitura` `Server Side` `IBM` `Codable Routing`

我們講過了 Router 跟 Middleware

接下來講講 Codable Routing

什麼是 Codable Routing

簡單說就是把使用者傳進來的 httpBody 使用 Codable 轉成 Model

只要轉不成指定的 Mode，就不會進到指定的 handle, 然後給出 error

<br>
以下給個比對的範例，會更容易了解

以下是會用到的幾個 Model

``` swift

    struct GeneralResponse<T: Codable>: Codable {
        let success: Bool = true
        let data: T
    }

    struct RequestModel: Codable {
        let name: String
    }
 
    struct MessageResponse: Codable {
        let success: Bool = true
        let message: String
    }

```

原本的 Router 寫法

``` swift

    router.post("/hello", allowPartialMatch: false, middleware: BodyParser())

    router.post("/hello") { req, res, next in
        
        guard let json = req.body?.asJSON else {
            res.status(.badRequest).send(json: ErrorResponse(message: "not correct request1"))
            return
        }
        
        guard let name = json["name"] as? String else {
            res.status(.badRequest).send(json: ErrorResponse(message: "not correct request2"))
            return
        }
        
        if name.isEmpty {
            res.status(.badRequest).send(json: MessageResponse(message: "not correct request3"))
        } else {
            res.status(.OK).send(json: GeneralResponse(data: "hello \(name), nice meet you"))
        }
    }

```

使用 Codable Routing 的寫法

``` swift

    router.post("/hello", handler: handler)

    func handler(model: RequestModel,
                 completion: (GeneralResponse<String>?, RequestError?) -> Void) {

        if model.name.isEmpty {
            let body = MessageResponse(message: "not correct request")
            let error = RequestError(.init(httpCode: 400), body: body)
            completion(nil, error)
        } else {
            completion(GeneralResponse(data: "hello \(model.name), nice meet you"), nil)
        }

    }

```

兩段接近就是等義的，如果 model 的 欄位更多的話， Code 的差距就會更多了

下一篇來講講 Codable Routing, Model Type Error Handle 

打完收工

<br>
#### Kitura 列表
#### <a href="/swift/kitura_1" target="_blank">Swift Server Side - Kitura (1) Install</a>
#### <a href="/swift/kitura_2" target="_blank">Swift Server Side - Kitura (2) SPM</a>
#### <a href="/swift/kitura_3" target="_blank">Swift Server Side - Kitura (3) Connect MySQL Server</a>
#### <a href="/swift/kitura_4" target="_blank">Swift Server Side - Kitura (4) MySQL 坑</a>
#### <a href="/swift/kitura_5" target="_blank">Swift Server Side - Kitura (5) Middleware</a>
#### <a href="/swift/kitura_6" target="_blank">Swift Server Side - Kitura (6) Router</a>
#### <a href="/swift/kitura_7" target="_blank">Swift Server Side - Kitura (7) Undefined Router Handle</a>
<br>