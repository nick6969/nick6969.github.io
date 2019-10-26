---
layout: post
title: "Kotlin Retrofit Interceptor Mock Data"
date: 2019-10-26 14:50:00 +0800
permalink: "kotlin/retrofit_mock_data"
tags: [Kotlin, Retrofit, Android, Mock, Interceptor, OkHttp]
categories: Kotlin
---

`Kotlin` `Retrofit` `Android` `Mock` `Interceptor` `OkHttp`
<br><br>
### <span style="color:#0089A7">筆記一下 如何在 Retrofit 上 Mock Data</span>
<br>
Retrofit 的 build() 會需要一個 OkHttpClient
OkHttpClient 可以使用 Interceptor 去處理 Request and Response
寫一個 MockDataInterceptor 就可以餵入假資料給 Retrofit
<br>
```kotlin
class MockDataInterceptor : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        // 一般來說 Mock 只應該在 Debug 模式下
        //  當然也可以指定特定的 Api
        return if (BuildConfig.DEBUG && chain.request().url().uri().path.endsWith("/mock")) {
            val message: String = "{\"success\":true,\"data\":\"Good Job, You got mock\"}"
            val messageBody = ResponseBody.create(
                MediaType.parse("application/json"), message.toByteArray()
            )
            Response
                .Builder()
                // 必要的有 code, request, protocol, message, 因為 build() 會檢查
                .code(200)
                .request(chain.request())
                .protocol(Protocol.HTTP_1_0)
                .message("put any thing you want")
                // header and body 看你自己的需求
                .addHeader("content-type", "application/json")
                .body(messageBody)
                .build()
        } else {
            // 當然，不攔截的時候，要使用正常程序繼續
            chain.proceed(chain.request())
        }
    }

}
```