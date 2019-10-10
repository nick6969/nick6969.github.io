---
layout: post
title:  "在 Swift 5 實作 AES 加解密 是簡單的"
date:   2019-10-11 01:30:00 +0800
permalink: "swift/aes"
tags: 
  - "Swift"
  - "AES"
  - "Cryptography" 
---

`Swift5` `Swift` `AES` `Cryptography`

### <span style="color:#0089A7">import library</span>


```swift

    import CommonCrypto

```

### <span style="color:#0089A7">define struct AESCrypt</span>

```swift

    private
    struct AESCrypt {
        private let key: Data
        private let ivSize: Int = kCCBlockSizeAES128
        private let options: CCOptions = CCOptions(kCCOptionPKCS7Padding)

        init(key: Data) throws {
            guard key.count == kCCKeySizeAES256 else {
                throw Error.invalidKeySize
            }
            self.key = key
        }
    }

```

### <span style="color:#0089A7">define AESCrypt error</span>

```swift

    private
    extension AESCrypt {
        enum Error: Swift.Error {
            case invalidKeySize
            case generateRandomIVFailed
            case encryptionFailed
            case decryptionFailed
            case dataToStringFailed
        }
    }

```

### <span style="color:#0089A7">implement AESCrypt randomIV</span>

```swift

    private
    extension AESCrypt {

        func generateRandomIV(for data: inout Data) throws {

            try data.withUnsafeMutableBytes { dataBytes in
                guard let dataBytesBaseAddress = dataBytes.baseAddress else {
                    throw Error.generateRandomIVFailed
                }

                let status: Int32 = SecRandomCopyBytes(
                    kSecRandomDefault,
                    kCCBlockSizeAES128,
                    dataBytesBaseAddress
                )

                guard status == 0 else {
                    throw Error.generateRandomIVFailed
                }
            }
        }
    }

```

### <span style="color:#0089A7">implement AESCrypt encrypt</span>

```swift

    private
    extension AESCrypt {

        func encrypt(_ string: String) throws -> Data {
            let data = Data(string.utf8)
            return try encrypt(data)
        }
        
        func encrypt(_ data: Data) throws -> Data {

            let bufferSize: Int = ivSize + data.count + kCCBlockSizeAES128
            var buffer = Data(count: bufferSize)
            try generateRandomIV(for: &buffer)

            var numberBytesEncrypted: Int = 0

            do {
                try key.withUnsafeBytes { keyBytes in
                    try data.withUnsafeBytes { dataToEncryptBytes in
                        try buffer.withUnsafeMutableBytes { bufferBytes in

                            guard let keyBytesBaseAddress = keyBytes.baseAddress,
                                let dataToEncryptBytesBaseAddress = dataToEncryptBytes.baseAddress,
                                let bufferBytesBaseAddress = bufferBytes.baseAddress else {
                                    throw Error.encryptionFailed
                            }

                            let cryptStatus: CCCryptorStatus = CCCrypt(
                                CCOperation(kCCEncrypt),
                                CCAlgorithm(kCCAlgorithmAES),
                                options,
                                keyBytesBaseAddress,
                                key.count,
                                bufferBytesBaseAddress,
                                dataToEncryptBytesBaseAddress,
                                dataToEncryptBytes.count,
                                bufferBytesBaseAddress + ivSize,
                                bufferSize,
                                &numberBytesEncrypted
                            )

                            guard cryptStatus == CCCryptorStatus(kCCSuccess) else {
                                throw Error.encryptionFailed
                            }
                        }
                    }
                }

            } catch {
                throw Error.encryptionFailed
            }

            let encryptedData: Data = buffer[..<(numberBytesEncrypted + ivSize)]
            return encryptedData
        }  
    }

```

### <span style="color:#0089A7">implement AESCrypt decrypt</span>

```swift

    private
    extension AESCrypt {

        func decrypt(_ data: Data) throws -> String {

            let bufferSize: Int = data.count - ivSize
            var buffer = Data(count: bufferSize)

            var numberBytesDecrypted: Int = 0

            do {
                try key.withUnsafeBytes { keyBytes in
                    try data.withUnsafeBytes { dataToDecryptBytes in
                        try buffer.withUnsafeMutableBytes { bufferBytes in

                            guard let keyBytesBaseAddress = keyBytes.baseAddress,
                                let dataToDecryptBytesBaseAddress = dataToDecryptBytes.baseAddress,
                                let bufferBytesBaseAddress = bufferBytes.baseAddress else {
                                    throw Error.encryptionFailed
                            }

                            let cryptStatus: CCCryptorStatus = CCCrypt(
                                CCOperation(kCCDecrypt),
                                CCAlgorithm(kCCAlgorithmAES128),
                                options,
                                keyBytesBaseAddress,
                                key.count,
                                dataToDecryptBytesBaseAddress,
                                dataToDecryptBytesBaseAddress + ivSize,
                                bufferSize,
                                bufferBytesBaseAddress,
                                bufferSize,
                                &numberBytesDecrypted
                            )

                            guard cryptStatus == CCCryptorStatus(kCCSuccess) else {
                                throw Error.decryptionFailed
                            }
                        }
                    }
                }
            } catch {
                throw Error.encryptionFailed
            }

            let decryptedData: Data = buffer[..<numberBytesDecrypted]

            guard let decryptedString = String(data: decryptedData, encoding: .utf8) else {
                throw Error.dataToStringFailed
            }

            return decryptedString
        }
    }

```

### <span style="color:#0089A7">Extension String</span>

```swift

  extension String {

    var aesEncrypted: Data? {
        let aes = try? AESCrypt(key: "your aes key")
        return try? aes?.encrypt(self)
    }  

  }

```

### <span style="color:#0089A7">Extension Data</span>

```swift

  extension Data {

    var aesEncrypted: Data? {
        let aes = try? AESCrypt(key: "your aes key")
        return try? aes?.encrypt(self)
    }

    var aesDecrypted: String? {
        let aes = try? AESCrypt(key: "your aes key")
        return try? aes?.decrypt(self)
    }

  }

```

### <span style="color:#0089A7">Quickly Use</span>

```swift

    "明文".aesEncrypted

    "密文".aesDecrypted

```