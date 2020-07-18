---
layout: post
title: "GitLab CI/CD (4)"
date: 2020-07-16 16:00:00 +0800
permalink: "GitLab/CI_CD-4"
tags: [GitLab, CI, CD, AWS, ECR, EKS, GCP, GCR, GKE]
categories: Server
---

`GitLab` `.gitlab-ci.yml` `CI` `CD` `AWS` `ECR` `EKS` `GCP` `GCR` `GKE`

<br>

接下來，我們就開始實做一個一個的 stage

這一篇只會說明 test 跟 build

.gitlab-ci.yml

```yaml
image: docker:19.03.11

stages:
  - test
  - build
  - deploy-Docker-Build
  - deploy-Manual

unit_test:
  stage: test
  image: golang:1.14.3-alpine
  script:
    - CGO_ENABLED=0 GOOS=linux go test ./...

build_App:
  stage: build
  image: golang:1.14.3-alpine
  script:
    - go build -o $CI_PROJECT_DIR/$PATH_NAME/app
```

相信有看前面的說明的朋友們基本上都看得懂

比較特別的應該是 CGO_ENABLED=0

因為是使用 alpine 的 image 環境去 build

如果沒有關閉 CGO，就會 Build 失敗

我的測試專案是 Public 的，所以可以點下面的 link 去看我加了上面的 yaml 檔後，執行的結果

<a href="https://gitlab.com/nick6969/gitlab_ci_cd/-/pipelines/168081245" target="_blank">Link</a>

deploy-Docker-Build / deploy-Manual 就由接下來的篇章介紹

打完收工

<br>
