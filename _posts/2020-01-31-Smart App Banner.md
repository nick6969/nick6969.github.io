---
layout: post
title: "iOS - Smart App Banner"
date: 2020-01-31 08:00:00 +0800
permalink: "iOS/Smart App Banner"
tags: [iOS, Smart App Banner]
categories: iOS
---

`iOS` `Smart App Banner` `Smart` `Banner`

<br>
先上個圖，讓大家清楚什麼是 Smart App Banner
<figure>
<a><img src="{{site.url}}/asset/Smart_App_Banner.jpg"></a>
</figure>

要顯示一個 Smart App Banner 其實很簡單

只需要在網頁的 head 裡面加上特定的 Meta

`<meta name="apple-itunes-app" content="app-id={AppStoreID}">`

AppStoreID 放置的是要顯示的 App 的 ID

<br>

接下來 用個簡單範例 讓大家可以在自己的 iOS Device 裡的 Safari 看到 Smart App Banner

首先下載 Test Html

<a href="{{site.url}}/asset/smart_app_banner.html" download>Download Test Html</a>

接下來打開 Terminal，切換到放置 Test Html 的資料夾，輸入

    python -m SimpleHTTPServer

這時候 LocalServer 就被啟動了

接下來只要使用 iOS Device 的 Safari 去連接到電腦的曲網 ip + port，看到檔案資料目錄，點擊 Test Html 就可以看到了

<figure>
<a><img src="{{site.url}}/asset/Smart_App_Banner1.jpg"></a>
</figure>

<br>
### <a href="https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html" target="_blank">參考資料</a>

打完收工