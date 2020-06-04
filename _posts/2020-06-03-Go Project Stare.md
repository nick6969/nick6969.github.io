---
layout: post
title: "go project 個人起手式"
date: 2020-06-03 10:40:00 +0800
permalink: "golang/start"
tags: [go, golang, env, gin, gorm, decimal, jwt]
categories: Golang
---

`golang` `go` `env` `gin` `gorm` `decimal` `jwt`

如同各種 server side 語言一樣

總是會使用各種不同的 library

這裡簡單紀錄一下 自己開一個新的 go project 時會使用的 library

<br>
Env - 不同環境使用不同的設定參數，這在 server side 是基本了，就不多解釋了

```powershell

  https://github.com/joho/godotenv

  go get github.com/joho/godotenv

```

<br>
Web Framework - 除非是只負責定時任務的 server，應該都會需要處理 Api call

```powershell

  https://github.com/gin-gonic/gin

  go get github.com/gin-gonic/gin

```

<br>
ORM - 這也應該算是 server side 標準配備了

```powershell

  https://github.com/jinzhu/gorm

  go get github.com/jinzhu/gorm

```

<br>
Decimal - 如果你會處理到金額，那麼浮點數誤差，就會讓你的報表金額對不起來

```powershell

  https://github.com/shopspring/decimal

  go get github.com/shopspring/decimal

```

<br>

JWT - Json Web Token 一種 token 規範

```powershell

  https://github.com/pascaldekloe/jwt

  go get github.com/pascaldekloe/jwt

```

<br>

Api Doc - 總是會需要出 api 文件給使用者方，半自動化產生也是節省時間

```powershell

  https://github.com/swaggo/swag

  go get -u github.com/swaggo/swag/cmd/swag

```

<br>
打完收工
