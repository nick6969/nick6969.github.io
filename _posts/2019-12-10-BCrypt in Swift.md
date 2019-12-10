---
layout: post
title:  "BCrypt in Swift"
date:   2019-12-10 13:10:00 +0800
permalink: "swift/bcrypt"
tags: [ Swift , Bcrypt , Cryptography] 
categories: Swift
---

`Swift` `Bcrypt` `Cryptography`

今天要介紹的是 Bcrypt, 一種加密演算法，為啥需要這個演算法，讓我們細細道來

我們都知道 Server side 不應該使用明碼儲存使用者的密碼

可是，就算是使用加密，Server side 還是保有解出密碼的解密 Key - 就會有人的風險

所以，最佳情境是使用保存密碼的 HASH 值

可是，保存密碼的 HASH 值還是有可能會被彩虹表(Rainbow table) 查找出來

所以，最佳情境是保存時加上 Salt，增加被對比出來的難度

可是，如果加的 Salt 是固定的，還是可以快速建立彩虹表來查找

可是，如果加的 Salt 是隨機的，那就產生另外一個問題，下次使用者使用密碼登入的時候，你要怎樣知道密碼是對的

<br>
登登~

### <a href="https://en.wikipedia.org/wiki/Bcrypt" target="_blank">Bcrypt</a>
詳細內容就請收看 Wiki(in 上方連結)

簡單說他就是一個可以解決我們上述的問題的演算法

使用隨機的 Salt，可以調整 Hash 的次數，讓相同的輸入每次都得到不同的結果

並且將 Salt 保存在最終的結果裡面

所以還是可以驗證 明文跟密文 是不是對應的

上個圖, 來源: https://stackoverflow.com/questions/27592732/what-should-be-stored-in-table-while-using-bcrypt
<br>
<figure>
<a><img src="https://i.stack.imgur.com/PNYHA.png"></a>
</figure>

下一個問題是，如果 Database 被搬走了，或者是 該密碼的 Hash 結果被洩露了

要怎樣增加密碼被解出來的難度(也只剩下增加時間難度了)

簡單說明，明文長度越長，會讓反解的時間加倍

將明文先做 HMAC 再做 BCrypt 安全性就增加更多了

<br>

### <a href="https://github.com/PerfectSideRepos/PerfectBCrypt" target="_blank">Perfect-BCrypt</a>

使用起來很簡單，基本上你只會需要使用三個 Function

``` swift

    import PerfectBCrypt

    // rounds 就是你要HASH的次數 , 4 ~ 31 太大太小都會報錯
    let salt = try BCrypt.Salt(._2A, rounds: round)

    // 取得 Hash 值
    let hashed = try BCrypt.Hash(password, salt: salt)

    // 檢查密碼是否跟密文相同
    let isSame = BCrypt.Check(password, hashed: hashed)

```

打完收工