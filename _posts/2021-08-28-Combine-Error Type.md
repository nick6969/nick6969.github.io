---
layout: post
title:  "Swift Combine - Error"
date:   2021-08-28 20:30:00 +0800
permalink: "Swift/Combine1"
tags: [ iOS , Swift , Combine , Error, Reactive programming ]
categories: Swift
---

 `iOS` `Swift` `Combine` `Error` `Reactive Programming`

 <br>

這是一個基本的使用 Combine 的網路請求

``` swift
func getData() -> AnyPublisher<Model, Error> {
    URLSession.shared.dataTaskPublisher(for: URL(string: "https://xxx.xx/xx")!)
        .map { $0.data }
        .decode(type: Model.self, decoder: JSONDecoder())
        .eraseToAnyPublisher()
}
```

看起來很正常，成功給 model，失敗給 model

問題是這個 func return 的 error 會有好幾種

以這個範例來說 會有 `URLError` `DecodingError`

實際 sink 的使用端，並不會知道這裡會出現多少種 error

合理的設計是要明確定義有多少種 error

例如 建立一個 ApiError

```swift
enum ApiError: Error {
    case url(error: URLError)
    case decode(error: Error)
}
```

再把 func 修改一下

```swift
func getData() -> AnyPublisher<Model, Error> {
    URLSession.shared.dataTaskPublisher(for: URL(string: "https://xxx.xx/xx")!)
        .mapError({ error in
            ApiError.url(error: error)
        })
        .map { $0.data }
        .decode(type: Model.self, decoder: JSONDecoder())
        .mapError({ error in
            if type(of: error) == ApiError.self {
                return error
            } else {
                return ApiError.decode(error: error)
            }
        })
        .eraseToAnyPublisher()
}
```

修改成這樣的確是達成了效果 但是會寫大量相同的 mapError

讓我們把大量相同的 mapError 換成自己定義的 operator

<script src="https://gist.github.com/nick6969/cdb7d8bb934c2f8c5496612670f52410.js"></script>

<br>

再修改一次 getData function

```swift
func getData() -> AnyPublisher<Model, ApiError> {
    URLSession.shared.dataTaskPublisher(for: URL(string: "https://xxx.xx/xx")!)
        .asError(type: ApiError.self, { .url(error: $0) })
        .map { $0.data }
        .decode(type: Model.self, decoder: JSONDecoder())
        .asError(type: ApiError.self, { .decode(error: $0)})
        .eraseToAnyPublisher()
}
```

這樣實作上，簡單許多，也更容易閱讀


<br>

打完收工