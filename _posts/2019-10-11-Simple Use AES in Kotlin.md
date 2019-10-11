---
layout: post
title:  "在 Android 上使用 kotlin 語言, 實作 AES 加解密 是簡單的"
date:   2019-10-11 00:56:00 +0800
permalink: "kotlin/aes"
tags: [ Kotlin , AES , Cryptography] 
categories: Kotlin
---

`Kotlin` `AES` `Cryptography`


### <span style="color:#0089A7">import library</span>
 

```kotlin

    import java.util.*
    import javax.crypto.Cipher
    import javax.crypto.spec.IvParameterSpec
    import javax.crypto.spec.SecretKeySpec
    
```

### <span style="color:#0089A7">implement Object AESCrypt</span>


```kotlin

    object AESCrypt {

        // 記得定義一下你的 key
        private const val key: String = "Your AES Key"
        // 這裡是宣告加解密的方法
        private const val transformation = "AES/CBC/PKCS5Padding"

        private val keySpec = SecretKeySpec(key.toByteArray(), 0, 32, "AES")
        private val ivParameterSpec = IvParameterSpec(key.toByteArray(), 0, 16)
        private val ByteArray.asHexUpper: String
            inline get() {
                return this.joinToString(separator = "") {
                    String.format("%02X", (it.toInt() and 0xFF))
                }
            }
        private val String.hexAsByteArray: ByteArray
            inline get() {
                return this.chunked(2).map {
                    it.toUpperCase(Locale.US).toInt(16).toByte()
                }.toByteArray()
            }


        // 加密使用的方法
        fun encrypt(input: String): String {
            val cipher = Cipher.getInstance(transformation)
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivParameterSpec)
            val encrypt = cipher.doFinal(input.toByteArray())
            return encrypt.asHexUpper
        }

        // 解密使用的方法
        fun decrypt(input: String): String {
            val cipher = Cipher.getInstance(transformation)
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivParameterSpec)
            val encrypt = cipher.doFinal(input.hexAsByteArray)
            return String(encrypt)
        }
    }

```

### <span style="color:#0089A7">Extension String</span>

```kotlin

    fun String.aesEncrypt(): String = AESCrypt.encrypt(this)

    fun String.aesDecrypt(): String = AESCrypt.decrypt(this)

```

### <span style="color:#0089A7">Quickly Use</span>

```kotlin

    "明文".aesEncrypt()

    "密文".aesDecrypt()

```