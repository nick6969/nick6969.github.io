---
layout: post
title: "Swift Server Side - Kitura (9) Codable Routing Error Handle"
date: 2019-12-14 12:25:00 +0800
permalink: "swift/kitura_9"
tags: [Swift, ServerSide, Kitura, Codable Routing, Error Handle]
categories: Swift
---

`Swift` `Kitura` `Server Side` `IBM` `Codable Routing` `Error Handle`

這一篇來講講 上一篇 Codable Routing 如果打進來的內容是轉不成 Model 的 Error Handle

前面講過 Undefined Router Handle 是放在最後一個，去判斷沒有人處理時才處理

Codable Routing 的 Error Handle 也是相同的概念

但是要判斷的 statusCode 是不一樣的

Codable Routing 只會丟出以下兩種 Status Code

``` swift

    // "The incoming content type cannot be handled."
    HTTPStatusCode.unsupportedMediaType

    // "The incoming payload could not be decoded."
    HTTPStatusCode.unprocessableEntity

```

知道會是什麼樣的 HTTPStatusCode

知道要在什麼時間點處理

那就上範例 Code 吧

``` swift 

    router.all { req, res, next in

        if res.statusCode == .unsupportedMediaType {
            // this is change return content
            _ = res.setWrittenDataFilter { _ in
                let message = #"{"success": false, "message": "no support media type"}"#
                return message.data(using: .utf8) ?? Data()
            }
            // this is put return type is json
            res.send(json: [:])
            try res.end()
        }
        
        if res.statusCode == .unprocessableEntity {
            // this is change return content
            _ = res.setWrittenDataFilter { _ in
                let message = #"{"success": false, "message": "not correct request"}"#
                return message.data(using: .utf8) ?? Data()
            }
            // this is put return type is json
            res.send(json: [:])
            try res.end()
        }
    }

```

或許大家會疑惑 為什麼要去設定 res.setWrittenDataFilter

這裡是因為 Kitura 在 return response Data 是設計不斷的 Append 上去的

所以我們只能在這個地方重新設定想要的 response

那既然已經放上我們自己想要的 return 內容了

為什麼還要 send 一個 空的 Json

這是因為 我們需要告訴 api request 我們傳回去的是 json 格式

<br>
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
#### <a href="/swift/kitura_8" target="_blank">Swift Server Side - Kitura (8) Codable Routing</a>
<br>