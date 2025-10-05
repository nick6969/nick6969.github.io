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
  const dateStr = post.date.toISOString();
  const displayDate = post.date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Read includes and replace Jekyll variables
  const adSense = fs.readFileSync('_includes/adSense.html', 'utf-8');
  const analytics = fs.readFileSync('_includes/analytics.html', 'utf-8');
  let header = fs.readFileSync('_includes/header.html', 'utf-8');
  
  // Replace Jekyll variables in header
  header = header.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');
  header = header.replace(/\{\{\s*site\.title\s*\}\}/g, siteTitle);
  
  // Process footer with Jekyll conditionals
  const footer = processFooter();
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="google-site-verification" content="I1wY0q5Vjp-BbrClzbJe2Qvn1B3oGvhAwgnlqZuprEU" />
  
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "ca-pub-9629129343379145",
      enable_page_level_ads: true
    });
  </script>
  
  <title>${post.title || siteTitle}</title>
  <meta name="description" content="${post.excerpt || siteDescription}">
  <link rel="canonical" href="${siteUrl}/posts/${post.slug}.html">
  <link rel="shortcut icon" type="image/png" href="/asset/favicon.ico">
  
  <link href="http://fonts.googleapis.com/css?family=Playball" rel="stylesheet">
  <link href="/assets/css/jekyllthemes.css" rel="stylesheet" />
  <link href="/assets/css/syntax.css" rel="stylesheet" />
</head>
${analytics}
<body>
  ${adSense}
  ${header}
  
  <div class="page-content">
    <div class="container" style="padding-left:0;padding-right:0;">
      <div class="row">
        <div class="col-md-1 col-xs-0"></div>
        <div class="col-md-10 col-xs-12">
          <article class="post post-contents" style="margin-bottom:30px;" itemscope itemtype="http://schema.org/BlogPosting">
            </br>
            <header class="post-header">
              <h1 class="post-title" itemprop="name headline">${post.title || ''}</h1>
              <p class="post-meta">
                <i class="fa fa-calendar">&nbsp;&nbsp;</i><time datetime="${dateStr}" itemprop="datePublished">${displayDate}</time>
                ${post.author ? `• <span itemprop="author" itemscope itemtype="http://schema.org/Person"><span itemprop="name">${post.author}</span></span>` : ''}
              </p>
            </header>
            
            <div class="post-content" style="margin:15px;" itemprop="articleBody">
              ${post.content}
            </div>
          </article>
          
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
  </div>
  
  ${footer}
</body>
</html>`;
}

posts.forEach(post => {
  const html = generatePostPage(post);
  fs.writeFileSync(`src/posts/${post.slug}.html`, html);
});

// Generate index page (home page)
const adSenseHome = fs.readFileSync('_includes/adSense.html', 'utf-8');
let headerHome = fs.readFileSync('_includes/header.html', 'utf-8');

headerHome = headerHome.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');
headerHome = headerHome.replace(/\{\{\s*site\.title\s*\}\}/g, siteTitle);

const footerHome = processFooter();

const homeLayout = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${siteTitle}</title>
    <meta name="description" content="${siteDescription}">
    <link rel="canonical" href="${siteUrl}/">
    <link href="http://fonts.googleapis.com/css?family=Playball" rel="stylesheet">
    <link href="/assets/css/jekyllthemes.css" rel="stylesheet" />
    <link href="/assets/css/syntax.css" rel="stylesheet" />
  </head>
  <body>
    ${adSenseHome}
    ${headerHome}
    
    <div class="page-content">
      <div class="container" style="padding-left:0;padding-right:0;">
        <div class="row">
          <div class="col-md-1 col-xs-0"></div>
          <div class="col-md-10 col-xs-12">
            <div class="post-list">
              ${posts.map(post => `
                <article class="post-item">
                  <h2><a href="/posts/${post.slug}.html">${post.title || post.slug}</a></h2>
                  <p class="post-meta">${post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  ${post.excerpt ? `<p>${post.excerpt}</p>` : ''}
                </article>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    ${footerHome}
  </body>
</html>
`;

fs.writeFileSync('src/index.html', homeLayout);

// Generate about page
const aboutContent = fs.readFileSync('about.markdown', 'utf-8');
const { data: aboutData, content: aboutMarkdown } = matter(aboutContent);
const aboutHtml = md.render(aboutMarkdown);

const adSenseAbout = fs.readFileSync('_includes/adSense.html', 'utf-8');
let headerAbout = fs.readFileSync('_includes/header.html', 'utf-8');

headerAbout = headerAbout.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');
headerAbout = headerAbout.replace(/\{\{\s*site\.title\s*\}\}/g, siteTitle);

const footerAbout = processFooter();

let aboutPage = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${aboutData.title || 'About'} - ${siteTitle}</title>
    <meta name="description" content="${siteDescription}">
    <link rel="canonical" href="${siteUrl}/about.html">
    <link href="http://fonts.googleapis.com/css?family=Playball" rel="stylesheet">
    <link href="/assets/css/jekyllthemes.css" rel="stylesheet" />
    <link href="/assets/css/syntax.css" rel="stylesheet" />
  </head>
  <body>
    ${adSenseAbout}
    ${headerAbout}
    
    <div class="page-content">
      <div class="container" style="padding-left:0;padding-right:0;">
        <div class="row">
          <div class="col-md-1 col-xs-0"></div>
          <div class="col-md-10 col-xs-12">
            <article class="post-contents">
              <h1>${aboutData.title || 'About'}</h1>
              ${aboutHtml}
            </article>
          </div>
        </div>
      </div>
    </div>
    
    ${footerAbout}
  </body>
</html>
`;

fs.writeFileSync('src/about.html', aboutPage);

// Generate 404 page
if (fs.existsSync('404.html')) {
  const content404 = fs.readFileSync('404.html', 'utf-8');
  fs.writeFileSync('src/404.html', content404);
}

console.log(`Generated ${posts.length} posts, index page, and about page`);
