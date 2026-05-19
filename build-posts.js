import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import fg from 'fast-glob';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// Site config from _config.yml
const siteTitle = "Nick's Technical Note";
const siteDescription = "This is Nick's Technical Note";
const siteUrl = "https://kotlin.tw";
const githubUsername = "nick6969";
const twitterUsername = "nicklin6969";

// Helper function to sanitize HTML by removing control characters
function sanitizeHtml(html) {
  // Remove control characters (0x00-0x1F except tab, newline, carriage return)
  // and other problematic Unicode characters
  return html.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
}

// Helper function to replace Jekyll variables in content
function replaceJekyllVariables(content) {
  return content
    .replace(/\{\{\s*site\.url\s*\}\}/g, siteUrl)
    .replace(/\{\{\s*site\.baseurl\s*\}\}/g, '')
    .replace(/\{\{\s*site\.title\s*\}\}/g, siteTitle)
    .replace(/\{\{\s*site\.description\s*\}\}/g, siteDescription);
}

// Format date as YYYY.MM.DD for display in post rows
function formatPostDate(date) {
  if (isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

function estimateReadTime(htmlContent) {
  const words = htmlContent.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Derive a short tag label from post frontmatter
function postTag(post) {
  if (post.categories) {
    const cats = Array.isArray(post.categories) ? post.categories[0] : post.categories;
    return String(cats).trim();
  }
  if (post.tags && post.tags.length) {
    return Array.isArray(post.tags) ? post.tags[0] : String(post.tags).split(',')[0].trim();
  }
  return '';
}

// Shared sidebar HTML (activePage: 'posts' | 'about')
function generateSidebar(activePage) {
  const postsActive = activePage === 'posts' ? ' active' : '';
  const aboutActive = activePage === 'about' ? ' active' : '';
  return `
    <aside class="sidebar">
      <div class="sidebar-inner">
        <div class="sidebar-logo" data-text="NICK&#10;BLOG">NICK<br>BLOG</div>
        <div class="sidebar-version">v2.0.0 <span class="sidebar-cursor"></span></div>
        <span class="sidebar-section-label">// navigate</span>
        <a href="/index.html" class="sidebar-nav-item${postsActive}">posts</a>
        <a href="/about.html" class="sidebar-nav-item${aboutActive}">about</a>
        <hr class="sidebar-divider">
        <span class="sidebar-section-label">// tags</span>
        <span class="sidebar-tag">iOS</span>
        <span class="sidebar-tag">Swift</span>
        <span class="sidebar-tag">Kotlin</span>
        <span class="sidebar-tag">Go</span>
        <span class="sidebar-tag">DevOps</span>
        <span class="sidebar-tag">K8s</span>
        <div class="sidebar-bottom">nick@blog:~$<br><span style="color:var(--amber);opacity:0.2">█</span></div>
      </div>
    </aside>`;
}

// Escape special characters for use in HTML attribute values
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Shared <head> block
function generateHead({ title, description, canonical, extra = '' }) {
  return `
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="google-site-verification" content="I1wY0q5Vjp-BbrClzbJe2Qvn1B3oGvhAwgnlqZuprEU">
    <title>${escapeAttr(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <link rel="canonical" href="${escapeAttr(canonical)}">
    <link rel="shortcut icon" type="image/png" href="/asset/favicon.ico">
    <link href="/assets/css/jekyllthemes.css" rel="stylesheet">
    <link href="/assets/css/syntax.css" rel="stylesheet">
    ${extra}
  </head>`;
}

// Helper function to process footer with Jekyll conditionals and includes
function processFooter() {
  let footer = fs.readFileSync('_includes/footer.html', 'utf-8');
  
  // Process GitHub username if condition
  if (githubUsername) {
    const githubIcon = fs.readFileSync('_includes/icon-github.html', 'utf-8')
      .replace(/\{\{\s*include\.username\s*\}\}/g, githubUsername);
    const githubSvg = fs.readFileSync('_includes/icon-github.svg', 'utf-8');
    const processedGithubIcon = githubIcon.replace(/\{\%\s*include\s+icon-github\.svg\s*\%\}/g, githubSvg);
    
    footer = footer.replace(
      /\{\%\s*if\s+site\.github_username\s*\%\}([\s\S]*?)\{\%\s*endif\s*\%\}/g,
      processedGithubIcon
    );
  } else {
    footer = footer.replace(/\{\%\s*if\s+site\.github_username\s*\%\}[\s\S]*?\{\%\s*endif\s*\%\}/g, '');
  }
  
  // Process Twitter username if condition
  if (twitterUsername) {
    const twitterIcon = fs.readFileSync('_includes/icon-twitter.html', 'utf-8')
      .replace(/\{\{\s*include\.username\s*\}\}/g, twitterUsername);
    const twitterSvg = fs.readFileSync('_includes/icon-twitter.svg', 'utf-8');
    const processedTwitterIcon = twitterIcon.replace(/\{\%\s*include\s+icon-twitter\.svg\s*\%\}/g, twitterSvg);
    
    footer = footer.replace(
      /\{\%\s*if\s+site\.twitter_username\s*\%\}([\s\S]*?)\{\%\s*endif\s*\%\}/g,
      processedTwitterIcon
    );
  } else {
    footer = footer.replace(/\{\%\s*if\s+site\.twitter_username\s*\%\}[\s\S]*?\{\%\s*endif\s*\%\}/g, '');
  }
  
  // Replace any remaining Jekyll include statements
  footer = footer.replace(/\{\%\s*include\s+[\w\-\.]+\s*.*?\%\}/g, '');
  
  return footer;
}

// Read all markdown posts
const posts = fg.sync('_posts/*.md').map(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const { data, content: markdown } = matter(content);
  
  // Replace Jekyll variables in markdown content before rendering
  const processedMarkdown = replaceJekyllVariables(markdown);
  
  let html = md.render(processedMarkdown);
  
  // Sanitize the HTML to remove control characters
  html = sanitizeHtml(html);
  
  const filename = path.basename(file, '.md');
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  
  let slug, date;
  if (match) {
    const [, year, month, day, title] = match;
    slug = title;
    date = new Date(`${year}-${month}-${day}`);
  } else {
    slug = filename;
    date = data.date ? new Date(data.date) : new Date();
  }
  
  return {
    ...data,
    slug,
    date,
    content: html,
    filename
  };
}).sort((a, b) => b.date - a.date);

// Create posts directory
if (!fs.existsSync('src/posts')) {
  fs.mkdirSync('src/posts', { recursive: true });
}

// Helper to generate full HTML page
function generatePostPage(post) {
  const displayDate = formatPostDate(post.date);
  const readTime = estimateReadTime(post.content);
  const tag = postTag(post);
  const adSense = fs.readFileSync('_includes/adSense.html', 'utf-8');
  const analytics = fs.readFileSync('_includes/analytics.html', 'utf-8');

  return `<!DOCTYPE html>
<html lang="zh-TW">
${generateHead({
  title: `${post.title || siteTitle} — Nick's Technical Note`,
  description: post.excerpt || siteDescription,
  canonical: `${siteUrl}/posts/${post.slug}.html`,
  extra: adSense
})}
<body>
  ${analytics}
  <div class="mobile-header">
    <span class="mobile-logo">NICK BLOG</span>
    <nav class="mobile-nav">
      <a href="/index.html" class="active">posts</a>
      <a href="/about.html">about</a>
    </nav>
  </div>
  <div class="page-shell">
    ${generateSidebar('posts')}
    <div class="main-content">
      <div class="topbar">
        <div class="topbar-path"><strong>~/posts</strong>/${escapeAttr(post.slug)}</div>
        <div class="topbar-right"><em>${displayDate}</em></div>
      </div>
      <div class="content-area">
        <div class="post-meta-row">
          ${tag ? `<span class="post-meta-tag">${escapeAttr(tag)}</span><span class="post-meta-sep">·</span>` : ''}
          <span class="post-meta-date">${displayDate}</span>
          <span class="post-meta-sep">·</span>
          <span class="post-meta-readtime">${readTime} min read</span>
        </div>
        <div class="post-title-line">
          <span class="post-title-prefix">//</span>${post.title || post.slug}
        </div>
        <hr class="post-divider">
        <div class="post-body" itemprop="articleBody">
          ${post.content}
        </div>
      </div>
      <div class="statusbar">
        <span class="statusbar-item">NORMAL</span>
        <span class="statusbar-sep">│</span>
        <span class="statusbar-item">posts/${escapeAttr(post.slug)}</span>
        <span class="statusbar-spacer"></span>
        ${tag ? `<span class="statusbar-item">${escapeAttr(tag)}</span><span class="statusbar-sep">│</span>` : ''}
        <span class="statusbar-item">UTF-8</span>
        <span class="statusbar-sep">│</span>
        <span class="statusbar-item">LF</span>
      </div>
    </div>
  </div>
  <script src="/js/terminal.js"></script>
</body>
</html>`;
}

posts.forEach(post => {
  const html = generatePostPage(post);
  fs.writeFileSync(`src/posts/${post.slug}.html`, html);
});

// Generate index page (home page)
const adSenseHome = fs.readFileSync('_includes/adSense.html', 'utf-8');
const analyticsHome = fs.readFileSync('_includes/analytics.html', 'utf-8');

const homeLayout = `<!DOCTYPE html>
<html lang="zh-TW">
${generateHead({
  title: siteTitle,
  description: siteDescription,
  canonical: `${siteUrl}/`,
  extra: adSenseHome
})}
<body>
  ${analyticsHome}
  <div class="mobile-header">
    <span class="mobile-logo">NICK BLOG</span>
    <nav class="mobile-nav">
      <a href="/index.html" class="active">posts</a>
      <a href="/about.html">about</a>
    </nav>
  </div>
  <div class="page-shell">
    ${generateSidebar('posts')}
    <div class="main-content">
      <div class="topbar">
        <div class="topbar-path"><strong>~/posts</strong> — Nick's Technical Note</div>
        <div class="topbar-right"><em>${posts.length}</em> entries</div>
      </div>
      <div class="content-area">
        <div class="posts-header">
          <span class="posts-title">// POSTS.LOG</span>
          <span class="posts-count">— sorted by date desc</span>
        </div>
        ${posts.map((post, idx) => {
          const tag = postTag(post);
          return `
        <a href="/posts/${post.slug}.html" class="post-row">
          <span class="post-row-idx">${String(idx + 1).padStart(2, '0')}</span>
          <span class="post-row-title">${post.title || post.slug}</span>
          ${tag ? `<span class="post-row-tag">${tag}</span>` : ''}
          <span class="post-row-date">${formatPostDate(post.date)}</span>
        </a>`;
        }).join('')}
      </div>
      <div class="statusbar">
        <span class="statusbar-item">NORMAL</span>
        <span class="statusbar-sep">│</span>
        <span class="statusbar-item">posts/index</span>
        <span class="statusbar-spacer"></span>
        <span class="statusbar-item">UTF-8</span>
        <span class="statusbar-sep">│</span>
        <span class="statusbar-item">LF</span>
      </div>
    </div>
  </div>
  <script src="/js/terminal.js"></script>
</body>
</html>`;

fs.writeFileSync('src/index.html', homeLayout);

// Generate about page
const aboutContent = fs.readFileSync('about.markdown', 'utf-8');
const { data: aboutData, content: aboutMarkdown } = matter(aboutContent);
const aboutHtml = md.render(aboutMarkdown);

const adSenseAbout = fs.readFileSync('_includes/adSense.html', 'utf-8');
const analyticsAbout = fs.readFileSync('_includes/analytics.html', 'utf-8');

const aboutPage = `<!DOCTYPE html>
<html lang="zh-TW">
${generateHead({
  title: `${aboutData.title || 'About'} — ${siteTitle}`,
  description: siteDescription,
  canonical: `${siteUrl}/about.html`,
  extra: adSenseAbout
})}
<body>
  ${analyticsAbout}
  <div class="mobile-header">
    <span class="mobile-logo">NICK BLOG</span>
    <nav class="mobile-nav">
      <a href="/index.html">posts</a>
      <a href="/about.html" class="active">about</a>
    </nav>
  </div>
  <div class="page-shell">
    ${generateSidebar('about')}
    <div class="main-content">
      <div class="topbar">
        <div class="topbar-path"><strong>~/about</strong></div>
        <div class="topbar-right"></div>
      </div>
      <div class="content-area">
        <div class="about-body">
          <h1>${aboutData.title || 'About'}</h1>
          ${aboutHtml}
        </div>
      </div>
      <div class="statusbar">
        <span class="statusbar-item">NORMAL</span>
        <span class="statusbar-sep">│</span>
        <span class="statusbar-item">about</span>
        <span class="statusbar-spacer"></span>
        <span class="statusbar-item">UTF-8</span>
        <span class="statusbar-sep">│</span>
        <span class="statusbar-item">LF</span>
      </div>
    </div>
  </div>
  <script src="/js/terminal.js"></script>
</body>
</html>`;

fs.writeFileSync('src/about.html', aboutPage);

// Generate 404 page
if (fs.existsSync('404.html')) {
  const content404 = fs.readFileSync('404.html', 'utf-8');
  fs.writeFileSync('src/404.html', content404);
}

console.log(`Generated ${posts.length} posts, index page, and about page`);
