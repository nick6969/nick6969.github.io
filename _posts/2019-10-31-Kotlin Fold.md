---
layout: post
title: "Kotlin Fold Reduce"
date: 2019-10-31 23:20:00 +0800
permalink: "kotlin/fold_reduce"
tags: [Kotlin, Fold, Reduce]
categories: Kotlin
---

`Kotlin` `Fold` `Reduce`

<br>
### <span style="color:#0089A7">Kotlin Reduce</span>

#### 剛開始寫 Kotlin 的時候

#### Array, ArrayList, List, MutableList
#### 就被這四個搞死了，因為 Swift 只有一種叫做 Array

#### 高階函數 

#### swift -> map, filter, reduce
#### kotlin -> map, filter, reduce, fold

<br>
## Kotlin 的 reduce 不等於 Swift 的 reduce

```kotlin
inline fun <S, T : S> Array<out T>.reduce(
    operation: (acc: S, T) -> S
): S
```
<br>
### <span style="color:#0089A7">Kotlin Fold</span>

## Kotlin 的 fold 等於 Swift 的 reduce
```kotlin
inline fun <T, R> Array<out T>.fold(
    initial: R, 
    operation: (acc: R, T) -> R
): R
```

<br>
### <span style="color:#FF0000">莫名其妙就跳坑了 囧</span>