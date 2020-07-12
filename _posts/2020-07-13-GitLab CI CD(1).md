---
layout: post
title: "GitLab CI/CD (1)"
date: 2020-07-13 00:00:00 +0800
permalink: "GitLab/CI_CD-1"
tags: [GitLab, CI, CD, AWS, ECR, EKS, GCP, GCR, GKE]
categories: Server
---

`GitLab` `CI` `CD` `AWS` `ECR` `EKS` `GCP` `GCR` `GKE`

<br>

### <a href="https://docs.gitlab.com/ee/ci/" target="_blank">GitLab CI/CD 官網 </a>

#### GitLab CI/CD is a tool built into GitLab for software development through the continuous methodologies:

#### Continuous Integration (CI) / Continuous Delivery (CD) / Continuous Deployment (CD)

<br>

接下來我們就來實際使用

一步一步來完成

把 Golang Project 自動化部屬到 AWS EKS or GCP GKE

<br>

------ 這是分隔線 ------

所有要執行的內容，設定都放在 `.gitlab-ci.yml`

`.gitlab-ci.yml` 預設需要放在 Git Repository 的根目錄位置 <a href="https://docs.gitlab.com/ee/ci/pipelines/settings.html#custom-ci-configuration-path" target="_blank">Link</a>

執行 CI/CD 內容的的機器，稱之為 Runner <a href="https://docs.gitlab.com/runner/" target="_blank">Link</a>

Runner 可以使用官方提供的 GitLab Shared Runner, 也可以自建 Runner

這一系列通通使用 GitLab Shared Runner 來實作, 就不介紹自建 Runner 了

<br>

打完收工

<br>
