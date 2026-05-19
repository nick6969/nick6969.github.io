# Terminal Blog Redesign — Design Spec

**Date:** 2026-05-19
**Status:** Approved

---

## Overview

Redesign Nick's Technical Note (kotlin.tw) from the current light Bootstrap-based Jekyll theme to a Terminal/Cyberpunk aesthetic. The site is a static blog built with Vite + custom Markdown-to-HTML pipeline, deployed to Cloudflare Pages.

---

## Design Decisions

| Dimension | Decision |
|---|---|
| Vibe | Terminal / Cyberpunk |
| Layout | Split: fixed sidebar (left) + main content (right) |
| Sidebar accent | Amber `#ff9500` |
| Content accent | Cyan `#00d4ff` |
| Post body typography | Readable serif (not monospace) |
| Animations | CSS Custom Properties + CSS animations + ~40 lines Vanilla JS |

---

## Colour System

All colours defined as CSS custom properties on `:root`. No hardcoded hex values outside the variable declarations.

```css
:root {
  --bg:           #0a0a0a;   /* page background */
  --sidebar-bg:   #080808;   /* sidebar background */
  --border:       #141414;   /* dividers and borders */
  --amber:        #ff9500;   /* sidebar accent: logo, active nav, cursor */
  --cyan:         #00d4ff;   /* content accent: headings, status bar, hover glow */
  --text:         #c8c8c8;   /* primary body text */
  --text-dim:     #444;      /* secondary / metadata text */
  --text-muted:   #222;      /* very dim: dates, line numbers */
  --tag-fg:       #005566;   /* post tag text */
  --tag-border:   #003344;   /* post tag border */
}
```

---

## Layout — Homepage (Post List)

### Structure

```
┌─────────────────────────────────────────────┐
│ ╔═══════════╦════════════════════════════╗  │
│ ║  SIDEBAR  ║  TOP BAR                   ║  │
│ ║           ╠════════════════════════════╣  │
│ ║  NICK     ║  // POSTS.LOG              ║  │
│ ║  BLOG     ║                            ║  │
│ ║  v2.0.0▌  ║  01  Post title   [tag] date ║ │
│ ║           ║  02  Post title   [tag] date ║ │
│ ║  // nav   ║  03  Post title   [tag] date ║ │
│ ║  ▶ posts  ║  ...                       ║  │
│ ║    about  ║                            ║  │
│ ║           ║  STATUS BAR (cyan)         ║  │
│ ╚═══════════╩════════════════════════════╝  │
└─────────────────────────────────────────────┘
```

### Sidebar (fixed, 140–160px wide)

- **Font:** `'Courier New', monospace` throughout
- **Logo:** `NICK BLOG` in `--amber`, with text-shadow glow `rgba(255,149,0,0.4)`
- **Version line:** `v2.0.0` + blinking amber cursor block
- **Section labels:** `// navigate`, `// tags` — very dim (`#2a2a2a`), uppercase
- **Nav items:** dim by default, active item in `--amber` with `▶` prefix
- **Tag list:** static list of topics (iOS, Swift, Kotlin, Go, DevOps, K8s)
- **CRT scanline overlay:** `::after` pseudo-element with `repeating-linear-gradient`, opacity subtle
- **Bottom:** `nick@blog:~$` prompt in very dim colour

### Top bar

- Path display: `~/posts — Nick's Technical Note`
- Right side: post count (e.g., `57 entries`) in `--cyan`
- Font: monospace, very small (0.65rem)

### Post list rows

- Sequential index number (01, 02 …) in `--text-muted`
- Post title in `--text`
- Tag badge: monospace, `--tag-fg` text, `--tag-border` border
- Date: `YYYY.MM.DD` format, `--text-muted`
- **Hover:** background shifts to `#0d1117`, left border appears in `--cyan`, title brightens to `#fff`

### Status bar (vim-style)

- Full-width bar filled with `--cyan` background, dark text
- Shows: `NORMAL │ posts/index │ ... │ UTF-8 │ LF`

---

## Layout — Post (Article) Page

### Structure

Same sidebar as homepage. Main area splits into:

1. **Top bar** — path `~/posts/<slug>`, date in `--cyan` on right
2. **Content area:**
   - Meta row: tag badge + date + read-time estimate
   - Title: `// Post Title` with `//` prefix in `--amber`, title text in `--text` (monospace)
   - Horizontal rule divider
   - **Article body** (typography switch):
     - Paragraphs: `'Georgia', serif` — readable for long-form Chinese + English
     - Section headings (`h2`, `h3`): `'Courier New', monospace` + `## ` / `### ` prefix in dim cyan
     - Inline code: small pill, `--cyan` text, dark background
     - Code blocks: left border in `--amber` (2px), dark background `#0d0d0d`, monospace
3. **Status bar** — same vim style, right side shows post language tag (Swift, Go, etc.)
4. **Sidebar back link:** `← cd ..` at bottom of sidebar, navigates back to post list

---

## Animations

All implemented with CSS `@keyframes` and a single small JS module (~40 lines). No npm packages added.

### 1. Typewriter (JS + CSS)

On every page load, the sidebar logo types out character-by-character:
- `NICK BLOG` appears over ~1.4s using CSS `animation: typing … steps(9, end)`
- After typing completes, `v2.0.0 ▌` fades in

### 2. Logo Glitch (CSS only)

- `::before` (cyan offset) + `::after` (red offset) pseudo-elements on logo
- `clip-path` splits top/bottom halves
- Triggers every 4s, lasts ~0.2s — subtle, not distracting

### 3. CRT Scanline (CSS only)

- Sidebar `::after` pseudo-element
- `repeating-linear-gradient` of alternating transparent/black stripes every 4px
- `pointer-events: none`, always on

### 4. Cursor Blink (CSS only)

- Amber block cursor `▌` next to `v2.0.0`
- `animation: blink 1s step-end infinite`
- Box-shadow glow for depth

### 5. Post Row Hover (CSS only)

- `transition: background 0.15s, border-left-color 0.15s` on each row
- `border-left: 2px solid var(--cyan)` appears on hover
- Title `color` transitions to `#fff`

---

## File Changes

### Modified files

| File | Change |
|---|---|
| `assets/css/jekyllthemes.css` | Full rewrite — CSS custom properties, dark base, sidebar layout, post list, post page typography |
| `assets/css/syntax.css` | Update syntax highlight colours for dark background |
| `src/index.html` | Update structure: add sidebar, top bar, status bar, post rows |
| `src/about.html` | Update structure: same sidebar + content layout |
| `src/posts/*.html` | Template update for each post: sidebar, terminal post header, vim status bar |

> Note: `_sass/` files are legacy (pre-migration). All active styling goes through `assets/css/jekyllthemes.css` directly. The SCSS files can be left as-is or removed separately.

### New files

| File | Purpose |
|---|---|
| `src/js/terminal.js` | Typewriter + glitch animations (vanilla JS, ~40 lines) |

### Unchanged

- `build-posts.js` — post generation pipeline untouched
- `vite.config.js` — build config untouched
- `_posts/*.md` — content untouched
- Deployment — `npm run build` → `dist/` → Cloudflare Pages, same as before

---

## Responsive Behaviour

- **Desktop (≥ 768px):** full split layout with sidebar
- **Mobile (< 768px):** sidebar collapses to a top bar showing `NICK BLOG` + hamburger or inline nav links; post list stacks vertically

---

## Non-Goals

- No pagination changes (keep existing structure)
- No dark/light mode toggle
- No search functionality
- No new npm dependencies
