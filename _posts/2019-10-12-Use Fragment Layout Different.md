---
layout: post
title:  "善用 Kotlin 語言特性，方便 Fragment 使用 Layout"
date:   2019-10-12 09:30:00 +0800
permalink: "android/fragmentUse"
tags: [ Android , Kotlin , Fragment] 
categories: Android
---

`Android` `Fragment` `Kotlin`

一般來說，使用 Fragment 都會寫像是下面這段 Code，來 inflate Layout


```kotlin

  class OriginalFragment: Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(
          R.layout.xxx, container, false
        )
    }

  }

```

個人一開始接觸的時候，覺得每一個 Fragment 都要寫一樣的內容，
只有 layout 是不一樣的，那為什麼不換個方式，讓事情簡單化

所以，那就來繼承吧

```kotlin

  abstract class BaseFragment: Fragment() {

    protected abstract val layout: Int

      override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(
            layout, container, false
        )
    }

  }

```

這時候使用起來就會像是這樣

```kotlin

  class Fragment001 : BaseFragment() {
    override val layout: Int = R.layout.xxx
  }

```

看起來不錯，可是 Fragment001 這一個 class 不會用到 layout 這一個參數，所以我們可以再換個寫法，讓 Fragment001 不會碰到 layout

```kotlin

  abstract class BaseFragment(private val layout: Int) : Fragment() {
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(layout, container, false)
    }

  }

```

這時候使用起來就會像是這樣

```kotlin

  class Fragment001: BaseFragment(R.layout.xxx) {
    
  }

```

方便簡單，一眼可以看清楚，Fragment 用了哪個 Layout

搞定，收工