---
layout: post
title: "Android Permission 之繼承包裝變好用"
date: 2019-10-14 15:00:00 +0800
permalink: "android/permission_inherit"
tags: [Android, Kotlin, Permission, Activity, Fragment]
categories: Android
---

`Android` `Kotlin` `Permission` `Activity` `Fragment`

Android 在 6.0 開始導入了使用者權限設定

App 在使用各種周邊資源時(檔案存取，藍芽，相機...)，都必須先取得權限

-- 又廢又長的標準 Code

要求 Permission 之前要先判斷，是不是已經有了

已有權限就直接做事，沒有權限就要求 Permission

一般來說就是像下面這樣(這裡使用 CAMERA 為例))

```kotlin
    private
    fun checkPermission() {
        if (ContextCompat.checkSelfPermission(
                context!!,
                Manifest.permission.CAMERA
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            // 沒有權限，要求權限
            requestPermissions(
                arrayOf(Manifest.permission.CAMERA),
                PERMISSION_REQUEST_CODE
            )
        } else {
            // 有權限 do you want to do
        }
    }
```

要求 Permission 之後，當使用者下了決定給或不給，會拿到選擇狀態，然後做事

```kotlin
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, 
                                         permissions, 
                                         grantResults)

        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // 使用者同意給權限
            } else {
                // 使用者不同意給權限
            }
        } else {
            // 這不是你發起要求的 Permission
        }
    }
```

然後每一個要權限的 Activity 跟 Fragment 都要寫這些一樣的東西

那就用繼承的方式包裝一下吧（以下使用 Activity 為例，Fragment 自行修改吧

```kotlin

    abstract class BaseActivity : AppCompatActivity() {
        
        // 定義一個成功拿到權限的 Method，並且給空實作，需要修改的再 override
        open fun requestGranted(requestCode: Int) { }
        
        // 定義一個沒有拿到權限的 Method，並且給空實作，需要修改的再 override
        open fun requestDenied(requestCode: Int)  { }

        // 實作一個檢查權限的 Method
        protected fun check(permissions: ArrayList<String>, requestCode: Int) {
            // 小於 Api Level 23 不需要要權限 當成成功
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
                requestGranted(requestCode)
                return
            }
            val ans = permissions.map {
                ContextCompat.checkSelfPermission(this, it) 
                == PackageManager.PERMISSION_GRANTED
            }.all { it }
            // 如果已有權限 就呼叫成功
            if (ans) {
                requestGranted(requestCode)
            } else {
                // 呼叫系統的，要求權限
                requestPermissions(permissions.toTypedArray(), requestCode)
            }
        }

        // 實作使用者選擇要與不要給權限後的 Call Back Method
        @TargetApi(Build.VERSION_CODES.M)
        override fun onRequestPermissionsResult(
            requestCode: Int,
            permissions: Array<out String>,
            grantResults: IntArray
        ) {
            super.onRequestPermissionsResult(requestCode, 
                                             permissions, 
                                             grantResults)

            if (grantResults.isEmpty()) return

            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // 使用者同意給予權限 呼叫我們定義好的拿到權限的 Method
                requestGranted(requestCode)
            } else {
                // 使用者不同意給予權限，呼叫我們定義好的拿不到權限的 Method
                requestDenied(requestCode)
            }
        }
    }

```

這時候使用起來就會簡單一點了

```kotlin
    // 要求權限
    val permissions: ArrayList<String> = arrayListOf(
        Manifest.permission.CAMERA
    )
    check(permissions, REQUEST_PERMISSION)
```

```kotlin
    override fun requestGranted(requestCode: Int) {
        // 拿到權限，確定 request code 是自己要的那一個
        if (requestCode != REQUEST_PERMISSION) return
        // Do you want to do
    }
```

```kotlin
    override fun requestDenied(requestCode: Int) {
        // 沒拿到權限，確定 request code 是自己要的那一個
        if (requestCode != REQUEST_PERMISSION) return
        // 做你想要在沒拿到權限做的事
    }
```

## <span style="color:#0089A7">Enjoy!</span>