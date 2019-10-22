---
layout: post
title: "Github Deployment to GCP K8S"
date: 2019-10-22 20:50:00 +0800
permalink: "server/github_deployment_gcp_k8s"
tags: [Github, GCP, K8S, Kubernetes]
categories: Server
---

`Github` `GCP` `K8S` `Kubernetes`

## <span style="color:#0089A7">Only Note All Flow</span><br><br>

### Github Commit<br>
### <span style="color:#FF2222">↓</span><br>
### WebHook to Google Cloud Source<br>
### <span style="color:#FF2222">↓</span><br>
### Google Cloud Source Mirror Github Repo<br>
### <span style="color:#FF2222">↓</span><br>
### Google Cloud Source Triggers Google Cloud Build with Some logic<br>
### <span style="color:#FF2222">↓</span><br>
### Google Cloud Build, Build Success, Interact with Kubernetes Engine<br>
### <span style="color:#FF2222">↓</span><br>
### Kubernetes Engine Pull New Docker Image<br>
### <span style="color:#FF2222">↓</span><br>
### Finish Done, Bye Bye<br>