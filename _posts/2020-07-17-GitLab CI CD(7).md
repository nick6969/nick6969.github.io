---
layout: post
title: "GitLab CI/CD (7) GCP Docker Build"
date: 2020-07-17 11:15:00 +0800
permalink: "GitLab/CI_CD-7"
tags: [GitLab, CI, CD, AWS, ECR, EKS, GCP, GCR, GKE]
categories: Server
---

`GitLab` `CI` `CD` `GCP` `Docker` `GCR`

<br>

底下我們要推到 GCP GCR 用到的 yaml 檔

```yaml
image: docker:19.03.11

variables:
  GCP_PROJECT_ID: your-project-id
  GCP_REGISTRY: us.gcr.io
  GCP_SOURCE_IMAGE_NAME: cicdTest

dockerBuildGCP:
  stage: deploy-Docker-Build
  script:
    - docker login -u _json_key --password-stdin https://us.gcr.io < $GCP_ACCOUNT_KEY
    - DOCKER_BUILDKIT=1 docker build . -t $GCP_SOURCE_IMAGE_NAME
    - docker tag $GCP_SOURCE_IMAGE_NAME $GCP_REGISTRY/$GCP_PROJECT_ID/$GCP_SOURCE_IMAGE_NAME
    - docker push $GCP_REGISTRY/$GCP_PROJECT_ID/$GCP_SOURCE_IMAGE_NAME
    - docker logout https://us.gcr.io
```

基本上跟上一篇<a href="/GitLab/CI_CD-6" target="_blank"> AWS ECR </a>差別不大，差別只在於 Docker 的登入方式不同

所以我們只講解 Docker 登入的方式

<a href="https://cloud.google.com/container-registry/docs/advanced-authentication#json-key" target="_blank">GCP GCR DOCKER 登入指令說明</a>

首先我們需要在 GCP 建立一個 service account， 給他 `Storage Admin` 的 role.

然後建立 service account 的 json key

```shell
gcloud iam service-accounts keys create --iam-account {iam email} {file name}
```

<br>

然後把 file 的內容放到 environment variables 裡面 我們這裡使用 GCP_ACCOUNT_KEY 當成 key 名

```bash
docker login -u _json_key --password-stdin https://us.gcr.io < $GCP_ACCOUNT_KEY
```

然後把 jsonkey 放進去當 password

登入搞定

接下來就是

Docker Build

Docker Tag

Docker Push

最後記得要

## <span style="color:#FF0000">docker logut</span>

## <span style="color:#FF0000">docker logut</span>

## <span style="color:#FF0000">docker logut</span>

很重要要講三次

跑完你就可以去網站上看到 image 已經推上去了

<br>
打完收工
