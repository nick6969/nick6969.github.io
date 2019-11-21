---
layout: post
title: "Swift Server Side - Kitura (2) SPM"
date: 2019-11-17 11:20:00 +0800
permalink: "swift/kitura_2"
tags: [Swift, ServerSide, Kitura, Swift Package Manager]
categories: Swift
---

`Swift` `Kitura` `Server Side` `IBM` `Swift Package Manager`

## <span style="color:#0089A7">Kitura</span>

<br>
#### 還沒安裝的可以前往這一篇觀看如何安裝
#### <a href="/swift/kitura_1" target="_blank">Swift Server Side - Kitura (1) Install</a>
<br>
#### Kitura 是一個 Swift 基底的 Server Side Framework
###### <br>
#### 使用 Swift Package Manager 管理第三方套件

#### Swift Package Manager (以下簡稱 SPM) 官方說明

###### <br>

#### <span style="color:#C968E8">The Swift Package Manager is a tool for managing the distribution of Swift code.It’s integrated with the Swift build system to automate the process of downloading, compiling, and linking dependencies.</span>

###### <br>

#### 使用方法很簡單，只要打開 Package.swift

#### 就可以看到類似如下的結構

```swift

import PackageDescription

let package = Package(
    name: "project",
    dependencies: [
        .package(url: "https://github.com/IBM-Swift/Kitura.git", .upToNextMinor(from: "2.8.0")),
        .package(url: "https://github.com/IBM-Swift/HeliumLogger.git", from: "1.7.1"),
        .package(url: "https://github.com/IBM-Swift/Health.git", from: "x.x.x"),
    ],
    targets: [
      .target(name: "project",
            dependencies: [ .target(name: "Application") ]),

      .target(name: "Application",
            dependencies: [ "Kitura", "Health" ]),

      .testTarget(name: "ApplicationTests" , 
            dependencies: [.target(name: "Application"), "Kitura", "HeliumLogger" ])
    ]
)

```
###### <br>
#### 所有你要使用的第三方 Framework 都會寫在 dependencies 裡面
#### 解釋一下寫入的內容
```swift
    // URL 指定路徑
    // upToNextMinor 可以某個版本以上 不超過大版本, 已範例 2.8.0 來說，不會安裝到 3.0.0 以上的版本
    .package(url: "https://github.com/IBM-Swift/Kitura.git", .upToNextMinor(from: "2.8.0")),
    // 直接使用 from 指定特定版本
    .package(url: "https://github.com/IBM-Swift/HeliumLogger.git", from: "1.7.1"),
    // 當然也可以使用 x.x.x 永遠抓最新的版本
    .package(url: "https://github.com/IBM-Swift/Health.git", from: "x.x.x"),

    // 還有可以指定某個 Branch, 某個 Commit, 也可以指定某個區間都接受的寫法
    // 等待你來發掘
```
###### <br>
#### 當然 Target 就是在指定哪些 Framework 只使用在哪些環境
###### <br>
#### 所以當你要添加一個新的 Framework 只需要在 dependencies 及 Target 上添加
#### 無可避免的你還是要到 Terminal 下指令
```

    // 根據 Package.swift 更新 Framework
    swift package update

    // 重新產生 Xcode Project 檔
    swift package generate-xcodeproj

```
###### <br>
#### <span style="color:#0089A7">以上就是安裝第三方 Framework 的流程</span>
#### <span style="color:#E88EB6">打完收工</span>
<br>

#### 下一篇
#### <a href="/swift/kitura_3" target="_blank">Swift Server Side - Kitura (3) Connect MySQL Server</a>
<br>
#### 上一篇
#### <a href="/swift/kitura_1" target="_blank">Swift Server Side - Kitura (1) Install</a>
<br>