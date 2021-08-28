---
layout: post
title:  "Swift Combine - Result"
date:   2021-08-29 01:00:00 +0800
permalink: "Swift/Combine2"
tags: [ iOS , Swift , Combine , Result, Reactive programming ]
categories: Swift
---

 `iOS` `Swift` `Combine` `Result` `Reactive Programming`

 <br>

我們有一個 Combine 取得網路料的 function

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

要拿到 error 或是 api 回來的 model，我們就會用 Sink 這一個 Operator

Combine 的 sink operator 有兩個

<a href="https://developer.apple.com/documentation/combine/fail/sink(receivevalue:)" target="_">func sink(receiveValue: @escaping ((Self.Output) -> Void)) -> AnyCancellable</a>

<a href="https://developer.apple.com/documentation/combine/just/sink(receivecompletion:receivevalue:)" target="_">func sink(receiveCompletion: @escaping ((Subscribers.Completion<Self.Failure>) -> Void), receiveValue: @escaping ((Self.Output) -> Void)) -> AnyCancellable
</a>

兩者的差別是 一個有 completion block 一個沒有

沒有 completion block 只能在 Output type == Never 才能使用

如果我們把 combine 用在網路層，我們只會收到一次資料，但是卻要兩個 block

像是這個樣子

```swift
getData().sink { state in
    switch state {
    case .finished:
        print("finished")
    case let .failure(error):
        print(error)
    }
} receiveValue: { model in
    print(model)
}.store(in: &disposables)
```

可是在 api 只回應一次內容的情境下，我們根本不會在乎 finished 這件事，因為拿到 error 或者是拿到 Model 就可以代表 finished

但是我們又不能使用只有 receiveValue block 的 sink Operator

因為我們的 api 是有機會有 error，不符合 Output type == Never

若是硬是要用怎麼辦呢

只好自己寫一個 operator，把原本的 Output 跟 Error 包成<a herf="https://developer.apple.com/documentation/swift/result" target="_">Result</a>

<script src="https://gist.github.com/nick6969/bd8f70fcefe7d41a926ebdf08ff42131.js"></script>

這樣使用起來就會簡單多了

```swift
getData()
    .transformToResult()
    .sink { result in
        switch result {
        case let .failure(error):
            print(error)
        case let .success(model):
            print(model)
        }
    }
```

打完收工