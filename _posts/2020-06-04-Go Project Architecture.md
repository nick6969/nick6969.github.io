---
layout: post
title: "Go Project Architecture"
date: 2020-06-04 12:30:00 +0800
permalink: "golang/project_architecture"
tags: [go, golang, project, architecture]
categories: Golang
---

`go` `golang` `project` `architecture`

上一篇講了專案起手式

接下來就會是 專案的架構上 會怎樣放檔案 怎樣切分職責

<br>
專案資料夾

main.go # 專案入口

.env-example # Env 內容 example

資料夾 Router # Api router

--- Router.go # Api router 設定入口

--- 資料夾 Middleware # Middleware 都放在這裡

資料夾 Service # 第三方的服務

資料夾 Database # Mysql / Redis 等等 ...

資料夾 Tools # jwt / crypto 等等...

資料夾 Static # 一些固定的檔案

<br>
打完收工
