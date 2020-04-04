---
layout: post
title: "Kotlin Gson RuntimeTypeAdapterFactory"
date: 2020-04-04 18:00:00 +0800
permalink: "kotlin/gson-RuntimeTypeAdapterFactory"
tags: [Kotlin, gson, RuntimeTypeAdapterFactory]
categories: Kotlin
---

`Kotlin` `gson` `convert` `multiplier type` `RuntimeTypeAdapterFactory`

#### <a href="https://github.com/google/gson" target="_blank">gson</a>

gson 是一個 android 開發者很常使用的 Json 轉換套件, 是 google 開發的

<BR>

在一般公司來說 Server Api Call return 的內容裡面，總是會出現類似下列這樣的 JSON 內容格式

```json
{
  "data": [
    {
      "type": "title",
      "name": "..."
    },
    {
      "type": "first",
      "data": [
        {
          "title": "",
          "description": ""
        }
      ]
    },
    {
      "type": "second",
      "data": [
        {
          "image_url": "https://xxx.xxx.xx/xx.jpg",
          "url": "https://xx.xxx.xx/xx/xx"
        }
      ]
    }
  ]
}
```

Array 裡面的的每一筆並不是一樣的格式

看到開始想的是，應該用什麼樣的 Model 去把些內容接下來，想不出來，就去跟後端說，這樣的格式不合理

後端把 前端 iOS 都找來問，前端 跟 iOS 都說他們可以接

那只好再想想辦法....

<BR>

<a href="
https://github.com/google/gson/blob/master/extras/src/main/java/com/google/gson/typeadapters/RuntimeTypeAdapterFactory.java" target="\_blank">RuntimeTypeAdapterFactory</a> 就是你需要的， 你可以在 gson 的 repo 裡面看到他

可是你若是在 Gradle 裡面，只有

```gradle

  implementation 'com.google.code.gson:gson:2.8.5'

```

是無法使用到的

他是被放在

```gradle

  implementation 'org.danilopianini:gson-extras:0.2.1'

```

<BR>

使用的方式基本上如下 (以上方的 JSON 為解析對象)

建立相對應的 Model, 記得要繼承同一個，這裡用的是 `BaseTestModel`

```kotlin

  open class BaseTestModel(val type: String)

  data class FirstModel(val title: String, val description: String)
  data class SecondModel(val image_url: String, val url: String)

  class TestTitleModel(type: String, name: String) : BaseTestModel(type)
  class TestFirstModel(type: String, data: List<FirstModel>) : BaseTestModel(type)
  class TestSecondModel(type: String, data: List<SecondModel>) : BaseTestModel(type)

```

建立一個 convertFactory

```kotlin

  private object TestResultFactory {

    private val baseAdapterFactory = RuntimeTypeAdapterFactory.of(BaseTestModel::class.java)
        .registerSubtype(TestTitleModel::class.java, "title")
        .registerSubtype(TestFirstModel::class.java, "first")
        .registerSubtype(TestSecondModel::class.java, "second")

    private val gson = GsonBuilder().registerTypeAdapterFactory(baseAdapterFactory).create()

    fun create(jsonElement: JsonElement?): BaseTestModel? {
        return gson.fromJson<BaseTestModel?>(jsonElement, BaseTestModel::class.java)
    }

  }

```

建立 SubClass of JsonDeserializer

```kotlin

  class TestDataDeserializer : JsonDeserializer<BaseTestModel> {

      override fun deserialize(
          json: JsonElement?,
          typeOfT: Type?,
          context: JsonDeserializationContext?
      ): BaseTestModel? {
          return TestResultFactory.create(json)
      }

  }

```

放在 gson Build 裡面去註冊

```kotlin

  GsonBuilder()
    .registerTypeAdapter(BaseTestModel::class.java, TestDataDeserializer())
    .create()

```

搞定, 可以順利把整個都正確的接下來了

當然取用的時候，記得要轉型，才可以取得每一個型別不同的內容

看來一切如此美好，自然就上線了

<BR>

某天，後端給的新的一個 type "main", app 顯示一片空白

千追萬追才發現，RuntimeTypeAdapterFactory 處理到沒有註冊的 type 就會 throw error

<a href="https://github.com/google/gson/blob/55acc23d8656a9fe5b19b92029a2dc7277e3765c/extras/src/main/java/com/google/gson/typeadapters/RuntimeTypeAdapterFactory.java#L240" target="\_blank">throw new JsonParseException("cannot deserialize " + baseType + " subtype named " + label + "; did you forget to register a subtype?");</a>

要怎樣避免加了一個新的 type 就讓整個解析失敗呢

那就不要傳入沒有註冊的 type 去解析

簡單說就是對 TestResultFactory 動一點手腳

```kotlin

  private object TestResultFactory {

    private val supportTypes: List<String> = listOf("title", "first", "second")
    private val baseAdapterFactory = RuntimeTypeAdapterFactory.of(BaseTestModel::class.java)
        .registerSubtype(TestTitleModel::class.java, "title")
        .registerSubtype(TestFirstModel::class.java, "first")
        .registerSubtype(TestSecondModel::class.java, "second")

    private val gson = GsonBuilder().registerTypeAdapterFactory(baseAdapterFactory).create()

    fun create(jsonElement: JsonElement?): BaseTestModel? {
        // 修改在這裡，判斷如果是 support 的 type 才去解析，否則直接 return Base Type
        return jsonElement?.asJsonObject?.deepCopy()?.remove("type")?.asString?.takeIf {
            it.isNotEmpty() && supportTypes.contains(it)
        }?.let {
            gson.fromJson<BaseTestModel?>(jsonElement, BaseTestModel::class.java)
        } ?: BaseTestModel("")
    }

  }

```

記得要解析完，要排除基本的 type，因為那是你沒有 Support 的 Type

<BR>
打完收工
