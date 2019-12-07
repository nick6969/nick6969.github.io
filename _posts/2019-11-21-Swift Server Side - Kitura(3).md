---
layout: post
title: "Swift Server Side - Kitura (3) Connect MySQL Server"
date: 2019-11-21 11:30:00 +0800
permalink: "swift/kitura_3"
tags: [Swift, ServerSide, Kitura, MySQL]
categories: Swift
---

`Swift` `Kitura` `Server Side` `IBM` `MySQL`

## <span style="color:#0089A7">Kitura</span>

<br>
#### 還沒安裝的可以前往這一篇觀看如何安裝
#### <a href="/swift/kitura_1" target="_blank">Swift Server Side - Kitura (1) Install</a>
<br>

#### 還不清楚 Swift Package Manager 如何使用的 請往這邊走
#### <a href="/swift/kitura_2" target="_blank">Swift Server Side - Kitura (2) SPM</a>
<br>

###### ----------------
###### <br>
Kitura 本身有建立起一整個完整的 Swift Server Side 生態系 (應該說是 IBM 建立起 Kitura 完整生態系)
<br>
有 Connect DataBase, ORM, JWT, HttpRequest, Environment, WebSocket, SMTP 等等

今天來介紹 SwiftKueryMySQL - 這是 IBM Open Source 的 MySQL Connect Framework
#### <a href="https://github.com/IBM-Swift/SwiftKueryMySQL" target="_blank">Github Link</a>

###### <br>

``` swift

    // Package.swift Add 
    .package(url: "https://github.com/IBM-Swift/SwiftKueryMySQL.git", from: "2.0.1"),

    // target's dependencies:
    .target(name: "your target", dependencies: ["SwiftKueryMySQL"]),

```
###### <br>

比較特別的是，需要在機器上安裝 MySQL，因為需要 MySQL 的一些 Framework 才能運作 （開發的機器跟 Product Server 都需要)

```shell

    // 安裝 MySQL 當然還是用 Homebrew
    brew install mysql

```

###### <br>
接下來就會有另一個問題

我們需要在 Xcode Project 指定 HEADER_SEARCH_PATHS 去找到 MySQL 的一些 Framework

可是我們的 Xcode Project 檔案是用 SPM 產生的

所以我們需要另一個檔案寫入我們要放進 Xcode Project 檔的設定 

``` shell

    // add New file Config.xcconfig
    HEADER_SEARCH_PATHS=/usr/include/mysql

```

然後建立好的 Config 檔案來建立 Xcode Project

``` shell

    swift package generate-xcodeproj --xcconfig-overrides Config.xcconfig

```

就可以使用 Xcode Project 繼續開發了
<br><br>
建立連線
``` swift

    // 這是建立單一 Connection
     public required init(host: String? = nil, 
                          user: String? = nil, 
                          password: String? = nil, 
                          database: String? = nil, 
                          port: Int? = nil, 
                          unixSocket: String? = nil, 
                          clientFlag: UInt = 0, 
                          characterSet: String? = nil, 
                          reconnect: Bool = true) 

    // 這是建立 Connection Pool
    public static func createPool(host: String? = nil,
                                  user: String? = nil, 
                                  password: String? = nil, 
                                  database: String? = nil, 
                                  port: Int? = nil, 
                                  unixSocket: String? = nil, 
                                  clientFlag: UInt = 0, 
                                  characterSet: String? = nil, 
                                  reconnect: Bool = true, 
                                  connectionTimeout: Int = 0, 
                                  poolOptions: ConnectionPoolOptions) -> ConnectionPool

```

建立 Connection Pool 最重要的參數

``` swift

    /// Options for `ConectionPool` configuration.
    public struct ConnectionPoolOptions {

        /// The initial number of connections in the pool.
        public let initialCapacity: Int
        
        /// The maximum number of connections in the pool. 
        /// The pool is allowed to grow from `initialCapacity` up to
        /// this limit. 
        /// If not specified, or `maxCapacity` <= `initialCapacity`, the pool cannot grow.
        public let maxCapacity: Int
        
        /// Initialize an instance of `ConnectionPoolOptions`.
        ///
        /// - Parameter initialCapacity: The initial number of connections in the pool.
        /// - Parameter maxCapacity: The maximum number of connections in the pool
        /// - Parameter timeout: Maximum wait (in milliseconds) to receive a connection
        ///                      before returning nil.
        public init(initialCapacity: Int, maxCapacity: Int = 0) {
            self.initialCapacity = initialCapacity
            self.maxCapacity = maxCapacity
        }
    }

```
Query 的使用方式
``` swift

    func rawQuery(with pool: ConnectionPool,
                  query: String,
                  success: @escaping ([[String: Any?]]) -> Void,
                  failure: @escaping (Error?) -> Void) {
        pool.getConnection { connect, error in
            guard let connect = connect else {
                failure(error)
                return
            }
            connect.execute(query, onCompletion: { result in
                result.asRows { dics, error in
                    if let dics = dics {
                        success(dics)
                    } else {
                        failure(error)
                    }
                }
            })
        }
    }

```

###### <br>
#### <span style="color:#E88EB6">打完收工</span>
<br>

附上 Linux 上安裝 MySQL 的指令
``` shell

    sudo apt-get update
    sudo apt-get install mysql-server libmysqlclient-dev pkg-config

```
#### 下一篇
#### <a href="/swift/kitura_4" target="_blank">Swift Server Side - Kitura (4) MySQL 坑</a>
###### <br>
#### 上一篇
#### <a href="/swift/kitura_2" target="_blank">Swift Server Side - Kitura (2) SPM</a>
<br>
