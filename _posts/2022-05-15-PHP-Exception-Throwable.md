---
layout: post
title:  "PHP Exception Throwable"
date:   2022-05-15 10:25:00 +0800
permalink: "iOS/php-exception throwable"
tags: [ PHP , Exception, Throwable ]
categories: PHP
---

<br>

新手筆記，只是紀錄踩過這個坑

``` php
try {

} catch (\Exception $ex) {

}
```

跟 
``` php
try {

} catch (\Throwable $th) {

}
```

catch 到的不同

ＸＤＤ