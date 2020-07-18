---
layout: post
title: "GitLab CI/CD (3) Project"
date: 2020-07-16 15:20:00 +0800
permalink: "GitLab/CI_CD-3"
tags: [GitLab, CI, CD, AWS, ECR, EKS, GCP, GCR, GKE]
categories: Server
---

`GitLab` `.gitlab-ci.yml` `CI` `CD` `AWS` `ECR` `EKS` `GCP` `GCR` `GKE`

<br>

如同我們一開始講的，這是一個將 Golang Project 自動化部屬到 AWS EKS or GCP GKE

所以，我們會建立一個小小的 project 來完成這整個流程

這個小 Project 只有一個 Api Endpoint，一個 Test, 一個 Docker file

main.go

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "{\"success\":true}")
	})

	log.Println(plus(1, 1))

	_ = http.ListenAndServe(":8080", nil)
}

func plus(lhs, rhs int) int {
	return lhs + rhs
}
```

<br>
main_test.go

```go
package main

import "testing"

func Test_plus(t *testing.T) {
	ans := plus(1, 1)
	if ans != 2 {
		t.Errorf("should got 2, but got %d", ans)
	}
}
```

<br>
DockerFile (Multi-Stage)

```shell
# build stage
FROM golang:1.14.3-alpine AS build-env
ADD . /src
ENV GOOS=linux
ENV GOARCH=amd64
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build cd /src && go build -o app

# final stage
FROM alpine
WORKDIR /app
COPY --from=build-env /src/app /app/
ENTRYPOINT ./app
```

<br>

<a href="https://gitlab.com/nick6969/gitlab_ci_cd" target="_blank">你可以在我的 GitLab 看到這個測試專案</a>

打完收工

<br>
