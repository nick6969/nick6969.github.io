---
layout: post
title:  "iOS SQLite Encryption"
date:   2021-04-26 09:30:00 +0800
permalink: "iOS/SQLite_Encryption"
tags: [ iOS , Swift , FMDB , SQLCipher , SQLite , Encryption ]
categories: Swift
---

`FMDB` `SQLCipher` `SQLite` `Audio` `Encryption` `iOS` `Swift`

<br>

如果你用 `sqlite` `encryption` `iOS` 去 google 搜尋

你會看到一堆 `SQLCipher` 的結果

我們來講講在 iOS 上面很受歡迎的操作 SQLite 的 Framework `FMDB` 跟 `SQLCipher` 怎樣搭配在一起用


<a href="https://github.com/ccgus/fmdb" target="_">FMDB</a> 的說明就有提到，提供了 SubModule 來使用 `SQLCipher`

以使用 CocoaPods 來說，只需要把 Podfile 裡的  pod 'FMDB' 更改成 pod 'FMDB/SQLCipher'

pod install

搞定，這時候需要的 `SQLCipher` 跟 `FMDB` 就安裝好了.

#### 寫在前面，如果你在網路上看到告訴你，直接去修改 Pod 裡面的程式碼的話，請千萬不要這樣作.

這樣的操作方式，就打破了 Third Party 的管理.

我們這邊要講的方式是 subClass 的方式.

只需要建立 FMDatabaseQueue and FMDatabase 的 subClass，使用我們建立的 subClass 就可以完成 encryption.

<br>

```swift
final class FMEncryptDatabase: FMDatabase {
    
    private let encryptKey: String = "you can setup password in here..."
    
    // FMDatabaseQueue 會根據 SQLite 版本決定呼叫的 open function
    // 分別為 open 跟 open(withFlags:vfs:)
    // 所以我們就只 override 這兩個 function
    override func open() -> Bool {
        let isOpen = super.open()
        if isOpen {
            setKey(encryptKey)
        }
        return isOpen
    }
    
    override func open(withFlags flags: Int32, vfs vfsName: String?) -> Bool {
        let isOpen = super.open(withFlags: flags, vfs: vfsName)
        if isOpen {
            setKey(encryptKey)
        }
        return isOpen
    }
}
```

```swift
final class FMEncryptDatabaseQueue: FMDatabaseQueue {
    
    override class func databaseClass() -> AnyClass {
        // 這裡是指定了 FMDatabaseQueue 會建立怎樣的 FMDatabase class
        return FMEncryptDatabase.self
    }

}
```

```swift
final class DatabaseManager {
    
    var queue: FMDatabaseQueue!
    
    let dbPath: String = ""// 填上你 database 要放的路徑

    func createDB() {
        if FileManager.default.fileExists(atPath: dbPath) {
            queue = FMEncryptDatabaseQueue(path: dbPath)
        } else {
            queue = FMEncryptDatabaseQueue(path: dbPath)
            queue.inTransaction { _, _ in
                // 看起來沒做事，但是建立 Database 之後，沒有操作的話，是不是有添加加密的功能進去的.
                // 一開始我也很疑惑為什麼 database 沒有被加密.
                // 後來才發現沒有操作就不會存取，
                // 因為沒有操作之前，只是生出了一個 database 檔案
            }
        }
    }
}
```

打完 搞定 收工