---
layout: post
title: "Swift Server Side - Kitura (4) MySQL 坑"
date: 2019-12-07 12:00:00 +0800
permalink: "swift/kitura_4"
tags: [Swift, ServerSide, Kitura, MySQL]
categories: Swift
---

`Swift` `Kitura` `Server Side` `IBM` `MySQL`

###### <br>
#### 上一篇
#### <a href="/swift/kitura_3" target="_blank">Swift Server Side - Kitura (3) Connect MySQL Server</a>
<br>

因為 Swift 語言 型別明確的前提

每個 MySQL Database 的型別 都應該可以對應到 Swift 的型別

可是 SwiftKueryMySQL 目前並沒有完整的支援全部的型別轉換

有幾個是我自己跳到的坑，也是需要特別注意的

MySQL Type `tintInt(1)` - 期待應該是轉成 Bool，但是會轉成 Int8

MySQL Type `decimal(10, 2)` - 期待應該是 Double，但是因為沒有 Support 這個類型，所以變成為 String

MySQL Type `json` - 期待應該是 String，給的也是 String，但是是因為沒有 Support，所以變成為 String

以上就是踩到 SwiftKueryMySQL 的坑(not all)
