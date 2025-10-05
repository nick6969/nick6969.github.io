# 問題修復記錄

## 問題 1: 控制字元錯誤 ✅ 已修復

**問題描述**: 
Markdown 轉換時產生的控制字元導致 Vite 的 HTML 解析器報錯。

```
Unable to parse HTML; parse5 error code control-character-in-input-stream
```

**解決方案**:
在 `build-posts.js` 中新增 `sanitizeHtml()` 函數，移除所有控制字元。

```javascript
function sanitizeHtml(html) {
  return html.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
}
```

---

## 問題 2: 圖片路徑顯示不正常 ✅ 已修復

**問題描述**:
Markdown 內容中的 Jekyll 變數（如 `{{site.url}}`）沒有被替換，導致圖片路徑錯誤。

**範例**:
```markdown
![圖片]({{site.url}}/asset/tdd_flow.png)
```

渲染後變成：
```html
<img src="{{site.url}}/asset/tdd_flow.png">  <!-- ❌ 錯誤 -->
```

**解決方案**:
在 `build-posts.js` 中新增 `replaceJekyllVariables()` 函數，在 Markdown 轉換前替換所有 Jekyll 變數。

```javascript
function replaceJekyllVariables(content) {
  return content
    .replace(/\{\{\s*site\.url\s*\}\}/g, 'https://kotlin.tw')
    .replace(/\{\{\s*site\.baseurl\s*\}\}/g, '')
    .replace(/\{\{\s*site\.title\s*\}\}/g, "Nick's Technical Note")
    .replace(/\{\{\s*site\.description\s*\}\}/g, "This is Nick's Technical Note");
}
```

**修復後**:
```html
<img src="https://kotlin.tw/asset/tdd_flow.png">  <!-- ✅ 正確 -->
```

---

## 驗證結果

### 檢查點

- ✅ 所有 58 篇文章成功建置
- ✅ 0 個未替換的 Jekyll 變數
- ✅ 5 篇文章包含圖片，路徑全部正確
- ✅ 所有圖片檔案已複製到 `dist/asset/`
- ✅ 建置時間：~160ms

### 受影響的文章

以下文章包含圖片引用，已全部修復：

1. `TDD_golang(1).md` - tdd_flow.png
2. `AVPlayer-iOS.md` - AVPlayer_Flow.png
3. `GitLab CI CD(5).md` - gitlab-cicd-env-var-01.png, gitlab-cicd-env-var-02.png
4. `Smart App Banner.md` - Smart_App_Banner.jpg, Smart_App_Banner1.jpg
5. `Swift Server Side - Kitura(5).md` - 其他圖片

### 測試指令

```bash
# 檢查未替換的變數
grep -r "{{site\." dist/

# 檢查圖片路徑
grep -rh 'src=".*asset/' dist/posts/*.html

# 驗證特定文章
grep "tdd_flow.png" dist/posts/TDD_golang\(1\).html
```

---

## 修復時間

**日期**: 2025年10月5日  
**狀態**: ✅ 已完成並驗證

所有問題已修復，網站可以正常顯示圖片！

---

## 問題 3: Footer 顯示都是程式碼 ✅ 已修復

**問題描述**:
Footer 中的 Jekyll 條件語法和 include 語句沒有被處理，直接顯示為文字：

```html
{% if site.github_username %}
<li>{% include icon-github.html username=site.github_username %}</li>
{% endif %}
```

**原因分析**:
Footer 包含複雜的 Jekyll 語法：
- 條件判斷：`{% if ... %} {% endif %}`
- Include 語句：`{% include icon-github.html %}`
- 參數傳遞：`username=site.github_username`
- 嵌套 include：icon 中又包含 SVG 的 include

**解決方案**:
在 `build-posts.js` 中新增 `processFooter()` 函數，完整處理 Footer 的 Jekyll 語法：

```javascript
function processFooter() {
  let footer = fs.readFileSync('_includes/footer.html', 'utf-8');
  
  // Process GitHub username if condition
  if (githubUsername) {
    const githubIcon = fs.readFileSync('_includes/icon-github.html', 'utf-8')
      .replace(/\{\{\s*include\.username\s*\}\}/g, githubUsername);
    const githubSvg = fs.readFileSync('_includes/icon-github.svg', 'utf-8');
    const processedGithubIcon = githubIcon.replace(
      /\{\%\s*include\s+icon-github\.svg\s*\%\}/g, 
      githubSvg
    );
    
    footer = footer.replace(
      /\{\%\s*if\s+site\.github_username\s*\%\}([\s\S]*?)\{\%\s*endif\s*\%\}/g,
      processedGithubIcon
    );
  }
  
  // Similar processing for Twitter...
  
  return footer;
}
```

**修復後**:
```html
<footer style="background-color: #c9c9c9">
  <div class="container">
    <a href="https://github.com/nick6969">
      <span class="icon icon--github">
        <svg viewBox="0 0 16 16">...</svg>
      </span>
      <span class="username">nick6969</span>
    </a>
    <br>
    <a href="https://twitter.com/nicklin6969">
      <span class="icon icon--twitter">
        <svg viewBox="0 0 16 16">...</svg>
      </span>
      <span class="username">nicklin6969</span>
    </a>
  </div>
</footer>
```

**處理的 Jekyll 語法**:
- ✅ `{% if site.github_username %}` - 條件判斷
- ✅ `{% include icon-github.html username=... %}` - Include 帶參數
- ✅ `{{ include.username }}` - Include 參數變數
- ✅ `{% include icon-github.svg %}` - 嵌套 include
- ✅ SVG 圖示正確嵌入

**驗證結果**:
- ✅ 0 個未處理的 Jekyll 語法
- ✅ GitHub 連結和圖示正確顯示
- ✅ Twitter 連結和圖示正確顯示
- ✅ 所有頁面（首頁、關於、文章）footer 都正確

---

## 修復時間線

1. **2025-10-05 初次遷移** - 完成 Jekyll 到 Vite 的基本遷移
2. **2025-10-05 修復控制字元** - 解決 HTML 解析錯誤
3. **2025-10-05 修復圖片路徑** - 替換 Markdown 中的 Jekyll 變數
4. **2025-10-05 修復 Footer** - 處理 Jekyll 條件和 include 語法

**最終狀態**: ✅ 所有問題已修復，網站完全正常運作
