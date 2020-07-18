---
layout: post
title: "GitLab CI/CD (5) environment variables"
date: 2020-07-17 00:00:00 +0800
permalink: "GitLab/CI_CD-5"
tags: [GitLab, CI, CD, AWS, ECR, EKS, GCP, GCR, GKE]
categories: Server
---

`GitLab` `.gitlab-ci.yml` `CI` `CD` `environment` `variables` `AWS` `ECR` `EKS` `GCP` `GCR` `GKE`

<br>

實做 Build Docker Image and Push to AWS ECR / GCP GCR 之前.

我們先來講講 GitLab CI/CD environment variables

這個 environment 是讓你存放一些環境變數在 runner 運作時使用，並可以簡單的保護

比如我們接下來幾篇才要介紹的 AWS 登入 / GCP 登入需要的 credentials，就不應該直接放在 `gitlab-ci.yaml` 裡面

選項的位置如下圖所示 (Setting -> CI / CD -> Variables)
<a><img src="{{site.url}}/asset/gitlab-cicd-env-var-01.png"></a>

增加新的 Variables 畫面如下
<a><img src="{{site.url}}/asset/gitlab-cicd-env-var-02.png"></a>

Key / Value 就不用多解釋了吧 😘

Type 選擇 Variable 跟 File 的差別在於，取用時 Variable 是給你填入的 Value， File 給的是檔案路徑．

Flags -> Proect variable 勾選了這個選項後，只有 Protected Branches 跑 job 時才會取到 Value.

Flags -> Mask variable 勾選了這個選項後， runner 運作的 Log 裡面，不會顯示 Value，會使用 mask 替代，避免 Value 外洩.

<br>
假設我有一個 Key / Value 是 TEST / Hello World!， type 是 Variable

就可以在 yaml 取得

```yaml
echo $TEST
```

如果是勾選了 Mask variable 會顯示 [MASKED]

如果是沒有勾選 Mask variable 會顯示 Hello World!

<br>

假設我有一個 Key / Value 是 TEST_FILE / Hello World!， type 是 File

就可以在 yaml 取得

```yaml
echo $TEST_FILE
```

就應該會得到像這樣的內容 /builds/{你的名稱}/{專案名稱}.tmp/TEST_FILE

這只是一個路徑，指向一個檔案，檔案內容就是你的 Value

<br>
打完收工
