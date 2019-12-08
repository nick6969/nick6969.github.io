---
layout: post
title: "Swift Server Side - Kitura (7) Undefined Router Handle"
date: 2019-12-07 20:00:00 +0800
permalink: "swift/kitura_7"
tags: [Swift, ServerSide, Kitura, Router]
categories: Swift
---

`Swift` `Kitura` `Server Side` `IBM` `Router`

前兩篇 我們講了 Router 跟 Middleware

可是我們都沒有提到第三個參數 next 到底是在幹嘛的

其實你寫的每一個 router.get / router.post ...

都會被放進 Router 裡面的陣列裡 (path, handle)

當 request 進來的時候

會將整個陣列 一個一個用 Regex 檢查是否符合

如果符合 會呼叫該個 handle

然後等待 handle 處理完 呼叫 next

再繼續往下執行，一路執行到沒有

這裡可能有些人會疑惑，已經有執行了，為啥還要繼續執行呢

其實這裡並沒有限制 同一個 path 只能有一個 handler 來處理，同一個 path 可以有很多組處理

##### <br>
### Undefined Router Handle

回到主題

當我們知道 Router 這個特性的時候

我們就可以想得到 在最後面 再加上一個處理全部 Method( get / post ....) 的 handle

再去判斷前面是否已經有人處理過了，沒人處理，再回應特定的錯誤訊息

```swift

    // 加在最後一個
    router.all { req, res, next in

        if res.statusCode == .unknown  {
            res.status(.badRequest).send(json: ["success": false)
        }

    }

```

當然你可以根據不同的 SubRouter 各自處理 就放在 SubRouter 裡面的最後一個就可以

<br>
#### Kitura 列表
#### <a href="/swift/kitura_1" target="_blank">Swift Server Side - Kitura (1) Install</a>
#### <a href="/swift/kitura_2" target="_blank">Swift Server Side - Kitura (2) SPM</a>
#### <a href="/swift/kitura_3" target="_blank">Swift Server Side - Kitura (3) Connect MySQL Server</a>
#### <a href="/swift/kitura_4" target="_blank">Swift Server Side - Kitura (4) MySQL 坑</a>
#### <a href="/swift/kitura_5" target="_blank">Swift Server Side - Kitura (5) Middleware</a>
#### <a href="/swift/kitura_6" target="_blank">Swift Server Side - Kitura (6) Router</a>
<br>