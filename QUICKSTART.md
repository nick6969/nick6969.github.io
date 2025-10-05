# 快速開始指南

## 前置需求

確保已安裝 Node.js (建議 v18 或更高版本)：
```bash
node --version
```

## 首次設定

```bash
# 安裝依賴套件
npm install
```

## 常用指令

### 建置網站（生產環境）
```bash
npm run build
```
- 輸出位置: `dist/` 目錄
- 用途: 部署到伺服器

### 開發模式（本地預覽）
```bash
npm run dev
```
- 自動開啟瀏覽器: http://localhost:5173/
- 支援即時重載

### 預覽建置結果
```bash
npm run preview
```
- 預覽 `dist/` 目錄內容
- 確保建置正確

## 新增文章

1. 在 `_posts/` 目錄建立 `.md` 檔案
2. 檔名格式: `YYYY-MM-DD-article-title.md`
3. 範例內容:

```markdown
---
title: 我的新文章標題
date: 2025-10-05
author: Nick
---

這是文章內容...

## 標題

段落內容。
```

4. 重新建置:
```bash
npm run build
```

## 專案結構速覽

```
_posts/          ← 在這裡新增文章
assets/          ← CSS 和圖片
dist/            ← 建置輸出（部署這個）
package.json     ← npm 設定
vite.config.js   ← Vite 設定
build-posts.js   ← 建置腳本
```

## 疑難排解

### 問題: npm install 失敗
```bash
# 清除快取重試
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 問題: 建置失敗
```bash
# 檢查錯誤訊息
npm run build

# 清除生成的檔案重試
rm -rf src/ dist/
npm run build
```

### 問題: 文章沒有出現
- 確認檔名格式正確: `YYYY-MM-DD-title.md`
- 確認 Front Matter 格式正確
- 重新建置: `npm run build`

## 部署

### GitHub Pages
1. 建置網站: `npm run build`
2. 將 `dist/` 內容推送到 `gh-pages` 分支

### 手動部署
1. 建置網站: `npm run build`
2. 上傳 `dist/` 目錄的所有內容到伺服器

## 更多資訊

- 完整說明: 參考 `README.md`
- 遷移資訊: 參考 `MIGRATION.md`
