---
layout: post
title:  "PHP Laravel ORM 坑 - Where 裡面包含 Join 會出錯"
date:   2022-06-19 14:00:00 +0800
permalink: "php/php-laravel-orm-01"
tags: [ PHP , Laravel, ORM, Where, Join ]
categories: PHP
---

`PHP` `Laravel` `ORM` `Where` `Join`

<h3>筆記一下，踩到的坑</h3>

在我們撈報表的時候，常常會有選項讓使用者選擇

比如像是: `All` `A` `B` ....

`All` 是其他全部選項的總和

這時候為了不要寫重複的 Code，就會把 `A` `B` 選項獨立寫成 function

然後 All 就會同時呼叫這兩個 function，會出現像是下面這樣的程式碼

<br>

``` php
switch ($type) {
    case 'All':
        $query->where(function($q1) {
            $q1->orWhere(function($q21) {
                $this->handleA($q21);
            });
            $q1->orWhere(function($q22) {
                $this->handleB($q22);
            });
        });
        break;

    case 'A':
        $this->handleA($query, ...)
        break;

    case 'B':
        $this->handleB($query, ...)
        break;

    default:
        abort(404);
}
```

<br>

`handleA` `handleB` 因為 Database 上的設計，必然會有 Join 的部分

當執行 Case `A` 或者是 執行 Case `B` 一切都正常

但是執行到 `All` 的時候，就出錯了

<br>

Log 會出現說 where 條件裡面指稱的 欄位不存在

<br>

為什麼會發生這個問題呢，後來去在 SQL 指令

發現當 Join 被放在 Where 條件裡面的時候

Join 的語法不會被放進去 SQL 指令 🥶

----

所以解決的方式就是把 Join 放到 Where 之外

修改一下上面的程式碼，成為這樣就解決了

<br>

``` php
switch ($type) {
    case 'All':
        $this->handleAJoin($query);
        $this->handleBJoin($query);
        $query->where(function($q1) {
            $q1->orWhere(function($q21) {
                $this->handleA($q21);
            });
            $q1->orWhere(function($q22) {
                $this->handleB($q22);
            });
        });
        break;

    case 'A':
        $this->handleAJoin($query);
        $this->handleA($query, ...)
        break;

    case 'B':
        $this->handleBJoin($query);
        $this->handleB($query, ...)
        break;

    default:
        abort(404);
}
```

<br>

真是奇怪的坑

筆者環境 `PHP 7.4.29` `Laravel Framework 5.8.38`

<br>

打完收工