---
layout: post
title: "Kotlin Date Operation"
date: 2019-10-25 11:20:00 +0800
permalink: "kotlin/date"
tags: [Kotlin, Date, Android]
categories: Kotlin
---

`Kotlin` `Date` `Android`
<br>
<br>
### <span style="color:#0089A7">取得當下的時間</span>

```kotlin
    val calendar = Calendar.getInstance()
```
<br>
### <span style="color:#0089A7">取得當下的年月日</span>

```kotlin
    val year = calendar.get(Calendar.YEAR)
    // 這裡要特別注意 Month 是從零開始的，也就是一月會拿到 0
    val month = calendar.get(Calendar.MONTH)
    val day = calendar.get(Calendar.DAY_OF_MONTH)
```
<br>
### <span style="color:#0089A7">設定特定的日期</span>

```kotlin
    // 設定 2019-10-25
    calendar.set(Calendar.YEAR, 2019)
    // 這裡一樣要特別注意 月份是從 0 開始
    calendar.set(Calendar.MONTH, 9)
    calendar.set(Calendar.DAY_OF_MONTH, 25)

    // 也可以一次設定年月日
    calendar.set(2019, 9, 25)
```
<br>
### <span style="color:#0089A7">加減日期</span>
```kotlin
    calendar.add(Calendar.YEAR, 1)
    calendar.add(Calendar.MONTH, -1)
    calendar.add(Calendar.DATE, 1)
```
<br>
### <span style="color:#0089A7">寫在最後</span>
不止有年月日可以使用，還有 `小時` 跟 `分` 跟 `秒` 可以操作