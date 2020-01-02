---
layout: post
title: "NodeJS Localhost SSL"
date: 2020-01-03 04:00:00 +0800
permalink: "nodejs/localhost_ssl"
tags: [NodeJS, ServerSide, SSL, Localhost]
categories: Swift
---

`NodeJS` `ServerSide` `SSL` `Localhost`

開發當中總是會有需求是，你需要在 Https 環境下，才能測試的

所以我們就會有需求是要怎樣導入 self signed certificate

導入了 self signed certificate 在 Localhost 環境之後

如果 Local Server 打到 Localhost, 要怎樣 pass validate ssl certificate

其實在 NodeJS 的官方文件裡面

就有詳細說明要怎樣解決這個問題

```swift

    // 導入 self signed certificate
    NODE_EXTRA_CA_CERTS="path"

```    


#### <a href="https://github.com/nodejs/node/blob/c7f328f0dfa961399b40d874cc8053841dcdc20a/doc/api/cli.md#node_extra_ca_certsfile" target="_blank">NODE_EXTRA_CA_CERTS 說明連結</a>


```swift

    // pass validate ssl certificate
    NODE_TLS_REJECT_UNAUTHORIZED="0"

```


#### <a href="https://github.com/nodejs/node/blob/c7f328f0dfa961399b40d874cc8053841dcdc20a/doc/api/cli.md#node_tls_reject_unauthorizedvalue" target="_blank">NODE_TLS_REJECT_UNAUTHORIZED 說明連結</a>

打完收工