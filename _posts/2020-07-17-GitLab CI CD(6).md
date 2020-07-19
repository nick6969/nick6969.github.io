---
layout: post
title: "GitLab CI/CD (5) AWS Docker Build"
date: 2020-07-17 10:50:00 +0800
permalink: "GitLab/CI_CD-5"
tags: [GitLab, CI, CD, AWS, ECR, EKS, GCP, GCR, GKE]
categories: Server
---

`GitLab` `CI` `CD` `AWS` `Docker` `ECR`

<br>

底下我們要推到 AWS ECR 用到的 yaml 檔

```yaml
image: docker:19.03.11

variables:
  AWS_CONTAINER_PATH: xxxxxx.dkr.ecr.us-east-2.amazonaws.com
  AWS_SOURCE_IMAGE_NAME: cicdTest

dockerBuildAWS:
  stage: deploy-Docker-Build
  script:
    - docker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY --rm amazon/aws-cli ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin $AWS_CONTAINER_PATH
    - DOCKER_BUILDKIT=1 docker build . -t $AWS_SOURCE_IMAGE_NAME
    - docker tag $AWS_SOURCE_IMAGE_NAME $AWS_CONTAINER_PATH/$AWS_SOURCE_IMAGE_NAME
    - docker push $AWS_CONTAINER_PATH/$AWS_SOURCE_IMAGE_NAME
    - docker logout $AWS_CONTAINER_PATH
```

前面我們講 Pipeline 沒有說到 variables 這個關鍵字

這個關鍵字是在 yaml 檔定義變數，可以在整個 yaml 檔裡面取用

方便修改調整

<br>

開啟 AWS ECR 的部分我們這邊就不贅述了

這邊只需要 AWS IAM 上面建好一個使用者，擁有 AmazonEC2ContainerRegistryFullAccess / AmazonEC2ContainerServiceFullAccess 的權限

把 IAM 使用者的 Access key ID 跟 Secret access key 存在 environment variables 裡面

分別是 AWS_ACCESS_KEY_ID 跟 AWS_SECRET_ACCESS_KEY

<br>

接下來，我們需要使用 Docker 登入 AWS ECR

<a href="https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ecr/get-login-password.html" target="_blank">AWS ECR DOCKER 登入指令說明</a>

然後就會遇到問題是，我們要怎樣可以有可以下 aws 指令的環境

既然我們跑在 Docker 環境下，那就來去找找有沒有 AWS 的 image 可以使用

找了一下 Docker hub，可以發現 AWS 官方有 <a href="https://hub.docker.com/r/amazon/aws-cli" target="_blank">amazon/aws-cli</a> 這一個 image

那我們就直接使用這一個 image 來登入吧

我們來拆解一下 script 第一行的指令

可以分成

```bash
docker run \
-e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
-e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
--rm amazon/aws-cli
```

這一段就是把 AWS_ACCESS_KEY_ID 跟 AWS_SECRET_ACCESS_KEY 放進 amazon/aws-cli image 執行

```bash
(第一段 aws) ecr get-login-password --region us-east-2
```

這一段就要給 amazon/aws-cli 執行的指令(第一段於是在當下環境打了 `aws`)

```bash
docker login \
--username AWS \
--password-stdin $AWS_CONTAINER_PATH
```

這一段就是官方說明的 Docker 登入 AWS ECR 指令的第二部分，就不贅述了

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
---- 我是分隔線 ----

如果在過程中遇到 `Cannot perform an interactive login from a non TTY device` 的錯誤訊息

只要確認輸入的帳號密碼是對的，就可以解決(個人一開始也是被這個搞了很久，才發現 environment variables 沒弄好)

<br>
打完收工
