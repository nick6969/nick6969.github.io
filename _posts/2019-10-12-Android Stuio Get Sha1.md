---
layout: post
title:  "Mac 上取得 Android Studio Debug Key Sha1"
date:   2019-10-12 14:00:00 +0800
permalink: "android/android-studio-sha1"
tags: [ Android , Sha1 , Android Studio ] 
categories: Kotlin
---

Google Map 要在 Debug 模式下 看到地圖

要在 Google console 加入 本機 Android Studio Debug Sha1

指令如下

```shell

  keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

```