---
layout: post
title:  "iOS UserDefault using @propertyWrapper"
date:   2021-01-29 16:30:00 +0800
permalink: "swift/propertyWrapper"
tags: [ Swift , propertyWrapper , UserDefault] 
categories: Swift
---

`Swift` `propertyWrapper` `UserDefault`

UserDefault 在 iOS 上是很常見儲存資料的方式

但是使用的時候需要填入 key 名，跟判斷有值與否決定新增或是加上

這邊是善用 Swift 5.1 新增加的 @propertyWrapper 來實作 UserDefault Tool

以下方的程式碼來說 只要直接取用 UDTool.sample 就可以 get / set UserDefault 裡面的內容了

<script src="https://gist.github.com/nick6969/5136bf0af65b940b740c07509b1e7607.js"></script>

打完 搞定 收工