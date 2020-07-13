---
layout: post
title: "GitLab CI/CD (2) Pipeline"
date: 2020-07-13 09:20:00 +0800
permalink: "GitLab/CI_CD-2"
tags: [GitLab, CI, CD, AWS, ECR, EKS, GCP, GCR, GKE]
categories: Server
---

`GitLab` `.gitlab-ci.yml` `CI` `CD` `AWS` `ECR` `EKS` `GCP` `GCR` `GKE`

<br>

.gitlab-ci.yml 就是在定義一整個流程，在 GitLab CI/CD 上面就稱為 `Pipeline`

Pipeline 底下又可以分成多個 `Stage`, 每個 Stage 又可以有多個 `Job`

<br>

首先先定義我們有多少個 Stage, 執行的順序會根據排列的順序

```yaml
stages:
  - test
  - build
```

接下來宣告 Jobs

```yaml
unit_test: # Job 的名稱
  stage: test # 指定是某個 Stage
  script: # Job 所要執型的內容
    - echo "unit_test"
```

Jobs 的執行順序，會是同一 Stage 的 Jobs，依據排列順序執行

寫到這裡，相信大家就會有疑問了，既然是使用 GitLab Shared Runner，哪裡來的 go 環境可以操作，又怎樣指定我們要的 go 版本

在這雲端化的時代，最簡單的選擇，當然就是使用 Docker 來解決這個問題

我們可以在 yaml 檔定義要使用哪個 Docker Image 來執行所有的 Job，也可以指定單一 Job 使用哪一個

```yaml
image: docker:19.03.11 # 全局設定，只要 Job 自己沒有指定，就會使用這一個

stage:
  - test
  - build

unit_test:
  stage: test
  image: golang:1.14.3-alpine # Job 自己指定了要使用的 Docker image
  script:
    - echo "unit_test"

build_App:
  stage: build
  script:
    - echo "build_App"
```

以上面這一個範例來說

unit_test 會跑在 golang:1.14.3-alpine 的 Container

而 build 則會跑在 docker:19.03.11 的 Container

<br>

另外一個問題來了

如果某些 Job 我只想要指定在某些 Branch，或者只有某些 Branch 不執行，那該要怎樣做呢
<a href="https://docs.gitlab.com/ee/ci/yaml/#onlyexcept-basic" target="_blank">Link</a>

```yaml
stage:
  - test
  - build

unit_test:
  stage: test
  only:
    - master
  script:
    - echo "unit_test"

build_App:
  stage: build
  except:
    - master
  script:
    - echo "build_App"
```

以上面這一個範例來說

unit_test 只會在 master 這一個 Branch 上面跑

build_App 只會在 master 以外的 Branch 上面跑

<br>

Pipeline 的設定先介紹到這邊

打完收工

<br>
