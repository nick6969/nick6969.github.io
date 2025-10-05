# Kotlin.tw

[Kotlin.tw](https://Kotlin.tw/?utm_source=github&utm_medium=github.io)

## 專案說明

本專案已從 Jekyll 遷移至 Vite。

## 技術棧

- **Vite**: 現代化的前端建置工具
- **Markdown**: 文章內容格式
- **Node.js**: 建置環境

## 開發指南

### 安裝相依套件

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

這會：
1. 執行 `build-posts.js` 將 `_posts/` 中的 Markdown 文章轉換為 HTML
2. 啟動 Vite 開發伺服器

### 建置生產環境

```bash
npm run build
```

這會：
1. 生成所有文章頁面
2. 建置靜態網站到 `dist/` 目錄

### 預覽建置結果

```bash
npm run preview
```

## 專案結構

```
.
├── _posts/              # Markdown 文章檔案
├── _layouts/            # 頁面版型（用於生成）
├── _includes/           # 可重用的 HTML 片段
├── assets/              # CSS、圖片等靜態資源
├── build-posts.js       # 文章建置腳本
├── vite.config.js       # Vite 設定檔
├── src/                 # 生成的 HTML（自動生成，不需手動編輯）
│   ├── index.html       # 首頁
│   ├── about.html       # 關於頁面
│   └── posts/           # 文章頁面
└── dist/                # 建置輸出（部署用）
```

## 新增文章

1. 在 `_posts/` 目錄中建立新的 Markdown 檔案
2. 檔名格式：`YYYY-MM-DD-title.md`
3. 檔案開頭加上 Front Matter：

```markdown
---
title: 文章標題
date: YYYY-MM-DD
author: 作者名稱（選填）
---

文章內容...
```

4. 執行 `npm run build` 重新建置

## 遷移說明

### 從 Jekyll 遷移的變更

- ✅ 改用 Vite 作為建置工具
- ✅ 保留所有 Markdown 文章
- ✅ 保留現有的 CSS 和資源檔案
- ✅ 保留網站結構和 URL
- ✅ 建置速度更快
- ✅ 更現代化的開發體驗

### 舊檔案保留

以下 Jekyll 相關檔案已保留供參考：
- `Gemfile`
- `_config.yml`
- `_layouts/`
- `_includes/`

這些檔案仍用於生成頁面範本。

## 部署

建置完成後，將 `dist/` 目錄的內容部署到 GitHub Pages 或其他靜態網站託管服務。

## License

ISC
