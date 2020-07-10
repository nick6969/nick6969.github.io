---
layout: post
title: "Google Cloud Platform(GCP) - Command"
date: 2020-07-10 08:00:00 +0800
permalink: "server/gcp_command"
tags: [GCP, Command]
categories: Server
---

`GCP` `Command`

<br>

### 列出 IAM 權限列表

```shell

  gcloud projects get-iam-policy {projectID}

```

{projectID} 專案的 id

<br>

### 建立 IAM Key

```shell

  gcloud iam service-accounts keys create --iam-account {iam email} {file name}

```

{iam email} 可以在 gcp 上面看到, 這是 IAM 權限對應的 email

{filename} 是指產生新的檔案的名稱

<br>

### IAM Key to json Key

```shell

  cat {key filename} | base64 > {filename}

```

{key filename} 是指原本取得的檔案名稱

{filename} 是指產生新的檔案的名稱

<br>

### Docker Login With JsonKey

```shell

  docker login -u _json_key --password-stdin {region} < {json filename}

```

{region} 目前有 `https://us.gcr.io` `https://eu.gcr.io` `https://asia.gcr.io` 這部分要去看 gcp 線上文件確認, 因為會不定時有新的

{json filename} 這裡要放的是 base64 過後的 Json file 名稱

<br>

### 列出 Service Account

```

  gcloud iam service-accounts list

```
