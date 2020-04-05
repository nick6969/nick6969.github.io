---
layout: post
title: "Android Kotlin Logger"
date: 2020-04-05 14:40:00 +0800
permalink: "kotlin/android-logger"
tags: [Kotlin, Android, Log, Logger]
categories: Kotlin
---

`Kotlin` `Android` `Log` `Logger`

Android 開發者最常使用的 Log 方式應該就是 `android.util.Log` 提供的 Log method

這些 Log method 就不在此說明了

但是這樣 Log 不會因為在 Production 環境或者是 Debug 環境不同而顯示或不顯示

所以一般來說都會自己寫一個 Logger Util

列一下 個人認為 Logger util 需要有的功能

1. 只在 Debug 環境下 Logger
2. 顯示 Log 發出的檔案名稱跟行數
3. 可以點擊顯示的檔案名稱跟行數直接切換到該檔案該行數

上 <a href="https://gist.github.com/nick6969/71438438c60a557f05b596d73477c77c" target="_blank">CODE</a> 可以直接到 Gist 去取得全文

```kotlin

  import android.util.Log
  import co.xxxx.xxxx.BuildConfig

  object LoggerUtil {

      private val isShowLog: Boolean = BuildConfig.DEBUG

      private enum class LogType { E, I, D, V, W }

      fun e(message: String) { log(LogType.E, message) }
      fun i(message: String) { log(LogType.I, message) }
      fun d(message: String) { log(LogType.D, message) }
      fun v(message: String) { log(LogType.V, message) }
      fun w(message: String) { log(LogType.W, message) }

      private fun log(type: LogType, log: String) {
          // 若是 Debug 環境 不顯示
          if (!isShowLog) return

          // 取出檔案名稱 行數 method名稱
          val stack = Throwable().stackTrace[2]
          val fileName = stack.fileName
          val lineNumber = stack.lineNumber
          val methodName = stack.methodName

          // 包含在()裡面的內容, 在 Logcat 裡面可以點擊
          val tag = "($fileName:$lineNumber)"
          val message = "$methodName: $log"
          when (type) {
              LogType.E -> Log.e(tag, message)
              LogType.I -> Log.i(tag, message)
              LogType.D -> Log.d(tag, message)
              LogType.V -> Log.v(tag, message)
              LogType.W -> Log.w(tag, message)
          }
      }

  }

```

打完收工
