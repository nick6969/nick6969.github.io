---
layout: post
title: "golang grom insert on duplicate 用法"
date: 2020-03-28 00:10:00 +0800
permalink: "golang/gorm-onDuplicate"
tags: [golang, gorm, ON DUPLICATE KEY UPDATE, mysql]
categories: Golang
---

`golang` `gorm` `mysql` `ON DUPLICATE KEY UPDATE`


gorm 是一個在 go 語言裡面相當受歡迎的 orm library

在實際使用上，我們很常會有找得到資料更新，找不到資料就寫入資料的需求

翻閱文件的時候會發現 Assign 這一段(<a href="https://gorm.io/docs/query.html#Assign-1" target="_blank">link</a>)，就是我們要的

文件上面也明確得讓你知道 會下兩次 SQL Query 來解決問題

可是本質上就是 Mysql 語法裡面的 `ON DUPLICATE KEY UPDATE` 

若是想要使用ㄏ減少 `ON DUPLICATE KEY UPDATE` 來減少 Query 次數

Extra Creating option 這一段(<a href="https://gorm.io/docs/create.html#Extra-Creating-option" target="_blank">link</a>)，就是我們要的

文件上寫的不是很清楚(個人認為)

以下用 Code 來解釋 (讓 code 自表述)

### Model
``` go

    type TestModel struct {
        ID        uint       `gorm:"primary_key;index"`
        Name      string     `gorm:"unique_index;not null;type:varchar(40)"`
        Value     string     `gorm:"type:text;"`
        CreatedAt time.Time  `gorm:"not null"`
        UpdatedAt time.Time  `gorm:"not null"`
        DeletedAt *time.Time `gorm:"index"`
    }

```

<BR>

### 使用 Assign
``` go
func FindItUpdateElseInsert(key string, value string) error {

	now := time.Now()

	find := TestModel{Name: key}
	update := TestModel{Value: value, UpdatedAt: now}
	insert := TestModel{Name: key, Value: value, CreatedAt: now, UpdatedAt: now}

    return db.Where(find).Assign(update).FirstOrCreate(&insert).Error
    
}
```

<BR>

### 使用 Extra Creating option
``` go

    func OnDuplicateUpdate(key string, value string) error {
        now := time.Now()
        model := TestModel{Name: key, Value: value, CreatedAt: now, UpdatedAt: now}
        return db.Set(
            "gorm:insert_option",
            "ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = Values(updated_at)",
        ).Create(&model).Error
    }

```
<BR>

兩個的差別在於

Assign 會下兩次 query

Extra Creating option 只會下一次

優劣 就端看個人怎樣取捨了

<BR>
#### <a href="https://github.com/jinzhu/gorm" target="_blank">Gorm Github</a>

<BR>
打完收工