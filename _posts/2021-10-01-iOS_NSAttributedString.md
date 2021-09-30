---
layout: post
title:  "iOS NSAttributedString 計算高度"
date:   2021-09-30 23:45:00 +0800
permalink: "iOS/NSAttributedString_calc_height"
tags: [ iOS , Swift , NSAttributedString, CoreText ]
categories: Swift
---

 `iOS` `Swift` `NSAttributedString`

在 iOS 系統上顯示文字，很常會用到 `NSAttributedString`

因為多行顯示的可能，會有計算高度的需求

常見的做法是使用 `boundingRect` 去計算

<br>

``` swift
extension NSAttributedString {
    func calcHeight(with width: CGFloat) -> CGFloat {
        let size: CGSize = CGSize(width: width, height: .greatestFiniteMagnitude)
        let options: NSStringDrawingOptions = [.usesLineFragmentOrigin, .usesFontLeading]
        let rect: CGRect = boundingRect(with: size, options: options, context: nil)
        return ceil(rect.height)
    }
}
```

比較少見的做法是使用 `CoreText` Framework 提供的 function 去計算

這裡附上程式碼

<br>

``` swift
extension NSAttributedString {
    func calcHeight(for width: CGFloat) -> CGFloat {
        guard self.string.count > 0 else { return 0 }
        let maxHeight: CGFloat = 10000
        let path: CGPath = CGPath(rect: .init(x: 0, y: 0, width: width, height: maxHeight), transform: nil)
        let frame: CTFrame = ctFrame(for: path)
        let lines: [CTLine] = CTFrameGetLines(frame) as! [CTLine]

        var ascent: CGFloat = .zero
        var descent: CGFloat = .zero
        var leading: CGFloat = .zero
        CTLineGetTypographicBounds(lines[lines.count - 1], &ascent, &descent, &leading)
        
        var origins: [CGPoint] = [CGPoint](repeating: .zero, count: lines.count)
        CTFrameGetLineOrigins(frame, CFRangeMake(0, 0), &origins)
        let last: CGPoint = origins[lines.count - 1]

        return ceil(maxHeight - last.y + descent) + 1
    }

    private
    func ctFrame(for path: CGPath) -> CTFrame {
        let cgpath: CGMutablePath = CGMutablePath()
        let rect: CGRect = path.boundingBox

        var tran: CGAffineTransform = CGAffineTransform.identity
        tran = tran.translatedBy(x: rect.origin.x, y: rect.origin.y)
        tran = tran.scaledBy(x: 1, y: -1)
        tran = tran.translatedBy(x: rect.origin.x, y: -rect.height)
        cgpath.addPath(path, transform: tran)
        cgpath.move(to: .zero)
        cgpath.closeSubpath()

        return CTFramesetterCreateFrame(
            CTFramesetterCreateWithAttributedString(self),
            CFRangeMake(0, self.length),
            CGPath(rect: rect, transform: nil),
            nil
        )
    }
}
```

CoreText Framework 已經是最後真的要畫上文字的時候的大小了，準確度可以說是百分之百了

<br>

打完收工