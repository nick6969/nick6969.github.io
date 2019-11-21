---
layout: post
title:  "Swift Server Side - Kitura (1) Install"
date:   2019-11-15 23:10:00 +0800
permalink: "swift/kitura_1"
tags: [ Swift , ServerSide , Kitura, Install] 
categories: Swift
---

`Swift` `Kitura` `Server Side` `IBM` `Install`

## <span style="color:#0089A7">What is </span><span style="color:#FF0000">Kitura</span>
###### <br>
#### Kitura is a web framework and web server that is created for web services written in Swift

#### <a href="https://github.com/IBM-Swift/Kitura" target="_blank">Kitura Github Repo</a>
<br>
寫一下 Mac 上的安裝流程，也當成紀錄

    環境
    MacOS 10.15.1
    Xcode 11.2.1

<br>
### 1. 安裝 Homebrew 
#### <a href="https://brew.sh/index_zh-tw" target="_blank">Homebrew Link</a>

```bash
    Homebrew 安裝指令

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

```
###### <br>
### 2. 安裝 Kitura

```bash

    brew install kitura

```
###### <br>
### 3. init Project

```bash

    先前往你想要放專案的位置，並且開一個空的資料夾，資料夾名稱會成為你的專案名稱

    kitura init

```
###### <br>
### 4. 建立 Xcode 專案
```bash

    在專案資料夾
    swift package generate-xcodeproj

```

就會得到 <專案名稱>.xcodeproj


#### <span style="color:#0089A7">以上就是安裝流程</span>
#### <span style="color:#E88EB6">打完收工</span>
<br>

#### 下一篇
#### <a href="/swift/kitura_2" target="_blank">Swift Server Side - Kitura (2) SPM</a>
