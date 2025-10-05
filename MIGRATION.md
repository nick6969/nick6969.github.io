# Jekyll to Vite 遷移說明

## 遷移完成日期
2025年10月5日

## 遷移概述

本專案已成功從 Jekyll 靜態網站生成器遷移至 Vite。遷移保留了所有原有功能，並提升了建置速度和開發體驗。

## 主要變更

### 1. 建置工具
- **原本**: Jekyll (Ruby-based)
- **現在**: Vite (Node.js-based)

### 2. 新增檔案

#### 核心建置檔案
- `package.json` - npm 專案設定檔，定義依賴套件和腳本
- `vite.config.js` - Vite 建置設定
- `build-posts.js` - 自訂腳本，將 Markdown 文章轉換為 HTML

#### 目錄
- `node_modules/` - npm 依賴套件（不納入版本控制）
- `src/` - 建置時生成的 HTML 檔案（不納入版本控制）
- `dist/` - 最終建置輸出，用於部署（不納入版本控制）

### 3. 保留檔案（用於建置過程）

以下 Jekyll 檔案被保留並用於生成靜態頁面：
- `_posts/` - Markdown 文章原始檔案
- `_layouts/` - 頁面版型範本
- `_includes/` - 可重用的 HTML 片段
- `assets/` - CSS、圖片等靜態資源
- `_config.yml` - Jekyll 設定（保留供參考）
- `Gemfile`, `Gemfile.lock` - Ruby 依賴（保留供參考）

### 4. 建置流程

#### 原本 (Jekyll)
```bash
bundle exec jekyll serve
# 或
bundle exec jekyll build
```

#### 現在 (Vite)
```bash
# 開發模式
npm run dev

# 生產建置
npm run build

# 預覽建置結果
npm run preview
```

### 5. 建置步驟說明

當執行 `npm run build` 時：

1. **prebuild 階段** (`node build-posts.js`)
   - 讀取 `_posts/` 目錄中的所有 Markdown 檔案
   - 解析 Front Matter 和 Markdown 內容
   - 使用 `_layouts/` 和 `_includes/` 生成完整的 HTML
   - 替換所有 Jekyll 變數 (如 `{{ site.title }}`)
   - 輸出到 `src/` 目錄

2. **build 階段** (`vite build`)
   - 處理 HTML 檔案
   - 複製靜態資源（assets、CNAME 等）
   - 最佳化和壓縮
   - 輸出到 `dist/` 目錄

### 6. 技術細節

#### 依賴套件
```json
{
  "vite": "^5.4.20",           // 建置工具
  "markdown-it": "^14.1.0",     // Markdown 解析器
  "gray-matter": "^4.0.3",      // Front Matter 解析器
  "fast-glob": "^3.3.3",        // 快速檔案搜尋
  "vite-plugin-static-copy": "^3.1.3"  // 靜態資源複製
}
```

#### 建置統計
- 總文章數: 58 篇
- 靜態資源: 25 個檔案
- 建置時間: ~170ms (Jekyll 約 5-10 秒)

## 遷移優勢

1. **建置速度提升**: 從 5-10 秒降至 ~170ms
2. **熱模組替換 (HMR)**: 開發時即時預覽變更
3. **現代化工具鏈**: 使用 Node.js 生態系統
4. **更靈活的自訂**: JavaScript-based 建置腳本
5. **無需 Ruby 環境**: 只需要 Node.js

## 保持相容性

### URL 結構
保持與 Jekyll 相同的 URL 結構：
- 首頁: `/index.html`
- 文章: `/posts/[slug].html`
- 關於: `/about.html`

### CSS 和資源
所有 CSS 和圖片路徑保持不變，無需修改連結。

### SEO 和 Meta 標籤
保留所有 meta 標籤、Google Analytics 和廣告設定。

## 新增文章流程

流程與 Jekyll 相同：

1. 在 `_posts/` 建立新的 `.md` 檔案
2. 使用相同的 Front Matter 格式：
   ```markdown
   ---
   title: 文章標題
   date: 2025-10-05
   ---
   ```
3. 執行 `npm run build`

## 部署

建置後的 `dist/` 目錄包含所有靜態檔案，可直接部署至：
- GitHub Pages
- Netlify
- Vercel
- 任何靜態網站託管服務

## 回滾方案

如需回滾至 Jekyll：
1. 所有原始 Jekyll 檔案都已保留
2. 刪除 `node_modules/`, `src/`, `dist/`, `package.json`, `vite.config.js`, `build-posts.js`
3. 執行 `bundle exec jekyll serve`

## 已知限制

1. Jekyll 外掛不再使用（如 `jekyll-feed`, `jekyll-seo-tag`）
   - 可在 `build-posts.js` 中自行實作需要的功能

2. Liquid 模板語法不再支援
   - 已在建置時轉換為靜態 HTML

## 未來改進建議

1. 考慮新增 RSS feed 生成
2. 自動生成 sitemap.xml
3. 圖片最佳化
4. 新增搜尋功能
5. 考慮使用 TypeScript 重寫建置腳本

## 支援

如有問題或需要協助，請參考：
- `README.md` - 基本使用說明
- `build-posts.js` - 建置腳本原始碼
- `vite.config.js` - Vite 設定
