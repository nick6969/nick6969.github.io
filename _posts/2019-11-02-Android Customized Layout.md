---
layout: post
title: "Android Customized Layout"
date: 2019-11-02 11:40:00 +0800
permalink: "android/customized layout"
tags: [Android, Kotlin, Layout, Customized]
categories: Android
---

`Android` `Kotlin` `Layout` `Customized`

## <span style="color:#0089A7">First Step</span>
### Write the .xml file, implement your design
### For the example we use RelativeLayout and call file the `test.xml`
```kotlin

<?xml version="1.0" encoding="utf-8"?>

<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="64dp"
        android:paddingTop="20dp"
        android:paddingBottom="20dp">

    <TextView
            android:id="@+id/textView"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_alignParentStart="true"
            android:layout_centerVertical="true"
            android:gravity="start"
            android:text="@string/empty"/>

</RelativeLayout>

```
<br>
## <span style="color:#0089A7">Second Step</span>
### Write the .kt file, for example call the `TestLayout.kt`
```kotlin

    class TestLayout(context: Context, attrs: AttributeSet) 
        : RelativeLayout(context, attrs) {

        init {
            inflate(context, R.layout.test, this)
        }

    }

```
<br>
### Now, you can use this layout in the other xml file
```kotlin

    <your_package_name.TestLayout

            android:id="@+id/recentActivity"
            android:layout_width="match_parent"
            android:layout_height="wrap_content">

    </your_package_name.TestLayout>

```

<br>
### Looking Good
### But can not set title with TestLayout container TextView in other xml file
# 😫😫😫😫😫😫
<br>
## <span style="color:#0089A7">Third Step</span>

### Create `attrs.xml` in the `res/values`
```kotlin

    <?xml version="1.0" encoding="utf-8"?>
    <resources>

        <declare-styleable name="TestLayout">
            <attr name="title" format="string" />
        </declare-styleable>

    </resources>

```
### Change `TestLayout.kt`
```kotlin

    class TestLayout(context: Context, attrs: AttributeSet) 
        : RelativeLayout(context, attrs) {

        init {
            inflate(context, R.layout.test, this)
            // add next three lines
            val attributes = context.obtainStyledAttributes(attrs, R.styleable.TestLayout)
            textView.text = attributes.getString(R.styleable.TestLayout_title)
            attributes.recycle()
        }

    }

```
### Now, you can set textView title in other xml file, Like this
```kotlin

    <your_package_name.TestLayout

            android:id="@+id/recentActivity"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            app:title="@string/good_job">

    </your_package_name.TestLayout>

```
<br>
## <span style="color:#0089A7">Finish Done, No No No</span>
<br>
### When use more more Customized Layout
### Setup more more the attr in the `attrs.xml`
### You will find, like can not setup the same name attr in the `attrs.xml`
# 😱😱😱😱😱😱
### It's fine, this is simple fix
### You can change your `attr.xml` like this
```kotlin

    <?xml version="1.0" encoding="utf-8"?>
    <resources>
        <attr name="title" format="string" />
        
        <declare-styleable name="TestLayout">
            <attr name="title"/>
        </declare-styleable>

    </resources>

```

## <a href="https://stackoverflow.com/a/4464966" target="_blank">Reference Link</a>