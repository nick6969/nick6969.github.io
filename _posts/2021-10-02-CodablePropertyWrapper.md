---
layout: post
title:  "Codable 跟 PropertyWrapper 的合作無邊"
date:   2021-10-02 14:50:00 +0800
permalink: "iOS/Codable_propertyWrapper"
tags: [ iOS , Swift , Codable, PropertyWrapper, Null, Nullable ]
categories: Swift
---

 `iOS` `Swift` `Codable` `PropertyWrapper` `Null` `Nullable`

  <br>

Codable 是 Swift 4 提供的 Encoding and Decoding 的 Tool.

相信大家應該都有用過 Codable，這裡就不多做解說(附上官方的說明跟教學)

<a href="https://developer.apple.com/documentation/swift/codable" target="_">Codable</a>

<a href="https://developer.apple.com/documentation/foundation/archives_and_serialization/encoding_and_decoding_custom_types" target="_">Codable 說明</a>


<br>

PropertyWrapper 是 Swift 5.1 提供的新的語法

相信大家應該都有用過 PropertyWrapper，這裡就不多做解說(附上官方的說明跟教學)

<a href="https://docs.swift.org/swift-book/LanguageGuide/Properties.html#ID617" target="_">PropertyWrapper</a>

<br>

這篇要講的是使用 PropertyWrapper 來解決一些我們在使用 Codable 上的痛點

有哪些痛點呢

1. init -
    
    Codable - 如果有一個值是要自己寫 encode 或 decode 就要全部都寫
    
    實務上 - 如果可以不要寫這麼多最好

2. Optional - 
    
    Codable - 如果有 key 值不對會 throw error
    
    實務上 - 期待拿到 nil

3. Default - 
    
    Codable - 如果找不到 key 或值是 null 會給出 nil
    
    實務上 - 期待在這個情境可以使用設定好的 default 值
    
<br>
    
接下來我們就實際一步一步解說，要怎樣使用 PropertyWrapper 來解決這些問題

``` swift 
struct Model: Codable {
    var data: UUID?
}

let json = Data(#"{"data":""}"#.utf8)

do {
    let model = try JSONDecoder().decode(Model.self, from: json)
    print(model)
} catch {
    print(error) 
}
```

上面這個範例，會拿到 error (痛點 2)

dataCorrupted(Swift.DecodingError.Context(codingPath: [CodingKeys(stringValue: "data", intValue: nil)], debugDescription: "Attempted to decode UUID from invalid UUID string.", underlyingError: nil))

<br>

為了解決這個問題，通常會這樣寫 (PropertyWrapper 還沒出場喔)

``` swift 
struct Model: Codable {
    var data: UUID?
    
    init(from decoder: Decoder) throws {
        let vals = try decoder.container(keyedBy: CodingKeys.self)
        data = try? vals.decodeIfPresent(UUID.self, forKey: .data)
    }
}
```

這個寫法就會 decode 成功

但是變成你有 30 變數，init(from decoder: Decoder) 就要寫三十個 (痛點 1)

<br>

有時候我們會有某個值沒有就使用 default 值，就會像以下這樣寫

``` swift
struct Model: Codable {
    var isValidate: Bool

    init(from decoder: Decoder) throws {
        let vals = try decoder.container(keyedBy: CodingKeys.self)
        isValidate = (try? vals.decodeIfPresent(Bool.self, forKey: .isValidate)) ?? false // false 是這裡設定的 default 值
    }
}
```

但是變成你有 30 變數，init(from decoder: Decoder) 就要寫三十個 (痛點 1)，一痛再痛 (誤: 多麼痛的領悟)

<br>

接下來我們就來說明怎樣用 PropertyWrapper 處理痛點1 跟 痛點2

首先建立一個 PropertyWrapper confirm Codable

``` swift
@propertyWrapper
struct Nullable<T: Codable>: Codable {
    var wrappedValue: T?

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        // 註 1
        wrappedValue = try? container.decode(T.self)
    }

    func encode(to encoder: Encoder) throws {
        // 註 2
        var container = encoder.singleValueContainer()
        try container.encode(wrappedValue)
    }

    // 註 3
    init(wrappedValue: T?) {
        self.wrappedValue = wrappedValue
    }
}
```

我們來解釋上面的 code 裡面的註釋

註1: 其實就跟上面一開始沒有 PropertyWrapper 時的解法相同，就是拿到值，值不同就給 nil

註2: 因為我們使用 PropertyWrapper 是多包一層，所以 encoder 預設是把整個 PropertyWrapper 拿去 encode，所以我們要自己寫 encode 只 encode wrappedValue

註3: 因為寫了 init，所以系統不會預設產生 init(wrappedValue: T?)，所以需要自己實作，方便設值時使用

來看看使用 PropertyWrapper 的範例

``` swift 
struct Model: Codable {
    @Nullable
    var data: UUID?
}

let json1 = Data(#"{"data":""}"#.utf8)
do {
    let model = try JSONDecoder().decode(Model.self, from: json1)
    print(model)
} catch {
    print(error)
}

let json2 = Data(#"{"data":null}"#.utf8)
do {
    let model = try JSONDecoder().decode(Model.self, from: json2)
    print(model)
} catch {
    print(error)
}

let json3 = Data(#"{}"#.utf8)
do {
    let model = try JSONDecoder().decode(Model.self, from: json3)
    print(model)
} catch {
    print(error)
}
```

json1 跟 json2 沒有問題，但是 json3 就會 failure.

fail 的原因是因為我們用了 PropertyWrapper 在 property 上

在預設產生的 init(from decoder: Decoder) 裡，是以非 nil 的方式去解析的

也就是會去呼叫

```swift
func decode<T: Codable>(_ type: Nullable<T>.Type, forKey key: Key) throws -> Nullable<T>
```

所以在找不到 key 的時候，就會 throw error.

所以我們需要去自己實作 decode function

```swift
func decode<T: Codable>(_ type: Nullable<T>.Type, forKey key: Key) throws -> Nullable<T> {
    return try decodeIfPresent(type, forKey: key) ?? .init(wrappedValue: nil)
}
```

json3 就可以正常解析，不會 throw error 了.

我們的修改是使用 decodeIfPresent 這樣找不到 key 會是 nil

如果是 nil 就使用 PropertyWrapper 包裝 nil

<br>

完整程式碼

<script src="https://gist.github.com/nick6969/292af34f319d37fd8c245b101e9fe88c.js"></script>

<br>

痛點3 的部分，我就不多敘述，直接附上別人寫好的教學

附上<a href="https://www.swiftbysundell.com/tips/default-decoding-values/" target="_">連結</a>

<br>

打完收工！
