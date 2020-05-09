---
layout: post
title: "MySQL Setup User"
date: 2020-05-08 18:00:00 +0800
permalink: "database/mysql-setup-user"
tags: [MySQL, User, Database, 8.0]
categories: Database
---

`MySQL` `User` `Database` `8.0`

### 筆記記錄一下 MySQL 8.0 新增使用者的操作

一. ssh 進 mysql 那一台 server，因為不同平台有太多種方式可以登入，就不在此列舉了

二. 登入 mysql server

```

  mysql -u root -p
  然後輸入密碼

```


三. 建立 database (如果你只是要把舊的 database 指給新使用者 就不用這一動了)

name 指的是 你要新建的 database 名稱
```

  create database '<name>;

```

四. 建立使用者

username 指的是你要設定的名稱

area 指的是這個帳號的作用區域, 全開是用 %, 通常來說不應該使用 % 因為代表任何地方都可連線, 應該要開啟特定的 ip

password 指的是使用者的密碼

```

  create user '<username>'@'<area>' IDENTIFIED BY '<password>';

```

五.  給使用者 特定 database 的權限

privilege 指的是權限 常用的是 all privileges

database_name 指的是你給的特定 database, 若是要給全部 可以用 *

table_name 指的是你給的特定的 table, 若是要給全部 可以用 *

user 這裡一樣要用 `username@area` 的格式

```

  grant <privilege> on <database_name>.<table_name> to <user>;

```

六. 設定好權限後，要通知 mysql 刷新權限

```

  flush privileges;

```


其他指令:

顯示所有 Database

```

  show databases;

```

顯示所有使用者

```

  select user, host from mysql.user;

```

打完 搞定 收工
