---
layout: post
title: "Go Database Integration Test"
date: 2020-08-09 19:00:00 +0800
permalink: "golang/database_integration_test"
tags: [golang, database, integration, test, mysql]
categories: Golang
---

`go` `golang` `database` `integration` `test` `mysql` `migration`

不是有了 Unit Test 保證每一個 function 都正確的運作就好了嗎，為什麼會需要 Integration Test.

先來看幾個 Unit Test Success，但是 Integration Test Fail 的 Case

<iframe width="560" height="315" src="https://www.youtube.com/embed/0GypdsJulKE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Oj8bfBlwHAg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br>

相信看完面的影片之後，你就會知道，為啥 Integration Test 很重要了

<br>
------ 這是分隔線 ------
<br>

Integration Test 跟 Unit Test 比較不同的是，你要怎樣重複執行 Test，而不會產生錯誤

這個有個範例，可以解釋重複執行時，會發生錯誤

Database 設計使用者名稱不能重複，我們測試增加使用者 Nick，第一輪 Test 會成功，第二輪就會失敗了

要避免這樣的問題，我們需要每次都提供全新的 Database 來避免這一個問題

<br>
------ 這是分隔線 ------
<br>

流程列出來如下

- 建立新的 Database Server and Database

- 執行 Migration

- 放入測試用的資料

- 開始測試

- 移除 Database

- 關閉 Database Server

<br>

### 1. 建立新的 Database Server and Database

這個時代 最快速的當然就是用 Docker 的技術來完成

我們使用 Docker-Compose 來完成，底下是 yaml 檔範例

```yaml
version: "3.8"
services:
  db:
    image: mysql:8.0
    container_name: mysql-integration
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=integration
    ports:
      - "13306:3306"
```

version 決定了你可以使用哪些指令，但也跟你的 Docker 版本相關．<a href="https://docs.docker.com/compose/compose-file/compose-versioning/" target="_blank">版本對照</a>

ports 是要特別注意的，如果你是在本地開發，你就會有跟你本地相同服務 Port 衝突的問題，若是遇到，就換個 port 吧

environment 裡面指定了 mysql root 帳號登入用的密碼，以及預設要建立的 Database

mysql 8.0 image 可以用的 environment 可以在 Docker-Hub mysql page 找到 <a href="https://hub.docker.com/_/mysql" target="_blank">Link</a>

<br>

### 2. 執行 Migration

Migration 之於 Database，就像是 Source Code 之於 Git，莓果你的 Database 沒有 Migration 的版本，在這個流程中，我們就無法建立整個所需要的 Table，以及放入運作所需的基本資料

個人是使用 <a href="https://github.com/golang-migrate/migrate/v4" target="_blank">migrate</a> 來操作

<br>

### 3. 放入測試用的資料

你可以讀取檔案來下 SQL Query 你也可以把它寫成 Migration 計畫，跟著 migrate 一起跑(反正 migrate 就是在開 table 放資料，就跟著一起)

<br>

### 4. 開始測試

特別要注意的是，連上的這個臨時 DB 才是你要連接的 DB，不要弄錯了

<br>

### 5. 移除 Database

```go
  db.Exec("DROP DATABASE " + databaseName).Error
```

<br>

### 6. 關閉 Database Server

當然 Docker 跑起來的服務，就把該 container 結束了就好

<br>

### 特別注意

忘了講很重要的步驟 2 ~ 5 都是要寫在 func TestMain(m \*testing.M) 裡面

這是一個特別的 function，當你有這個 function 時，只會執行這個 function

還有 Docker 把各種 server 叫起來會需要時間，不能直接跑測試，需要等該服務可以操作了，才開始測試

最重要的是要使用 test tags，將 test 分類，千萬別在一般環境下，直接跑 integration Test.

<br>

### DemoProject

<a href="https://github.com/nick6969/integration_test" target="_blank">Link</a>

<br>
<br>
參考資料: <a href="https://en.wikipedia.org/wiki/Integration_testing" target="_blank">Integration Testing Wiki</a>
