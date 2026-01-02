const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../src/data');

// Helper to find matching brace
function findMatchingBrace(content, startIndex) {
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let prevChar = '';
  let inTemplateString = false;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];

    // Handle template strings separately (they can span multiple lines and contain ${})
    if (char === '`' && prevChar !== '\\') {
      inTemplateString = !inTemplateString;
      if (inTemplateString) inString = true;
      else inString = false;
    }

    // Handle regular strings
    if (!inTemplateString && (char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }

    if (!inString && !inTemplateString) {
      if (char === '{') depth++;
      if (char === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }

    prevChar = char;
  }

  return -1;
}

// Extract metadata from a full object string
function extractFromObject(objStr) {
  // Helper to extract a string field
  const extractString = (fieldName) => {
    // Look at the end of the object (after content)
    const patterns = [
      new RegExp(`${fieldName}:\\s*"([^"]*)"`, 's'),
      new RegExp(`${fieldName}:\\s*'([^']*)'`, 's'),
    ];

    for (const pattern of patterns) {
      const match = objStr.match(pattern);
      if (match) return match[1];
    }
    return '';
  };

  const extractNumber = (fieldName, defaultVal = 10) => {
    const match = objStr.match(new RegExp(`${fieldName}:\\s*(\\d+)`));
    return match ? parseInt(match[1]) : defaultVal;
  };

  const extractBoolean = (fieldName) => {
    const match = objStr.match(new RegExp(`${fieldName}:\\s*(true|false)`));
    return match ? match[1] === 'true' : undefined;
  };

  const id = extractString('id');
  const title = extractString('title');

  if (!id || !title) return null;

  const meta = {
    id,
    title,
    excerpt: extractString('excerpt'),
    category: extractString('category') || 'כללי',
    readTime: extractNumber('readTime', 10),
    image: extractString('image') || '/images/blog/placeholder.webp',
    slug: extractString('slug') || id,
    date: extractString('date') || '1 ינואר 2025'
  };

  const featured = extractBoolean('featured');
  if (featured) meta.featured = true;

  // Extract author
  const authorMatch = objStr.match(/author:\s*\{([^}]+)\}/);
  if (authorMatch) {
    const authorName = authorMatch[1].match(/name:\s*["']([^"']+)["']/);
    if (authorName) {
      meta.author = { name: authorName[1] };
    }
  }

  // Extract tags
  const tagsMatch = objStr.match(/tags:\s*\[([^\]]+)\]/);
  if (tagsMatch) {
    const tags = tagsMatch[1].match(/["']([^"']+)["']/g);
    if (tags) {
      meta.tags = tags.map(t => t.replace(/["']/g, ''));
    }
  }

  return meta;
}

// Extract metadata from a blog file
function extractMetadata(content) {
  const metadata = [];

  // Find array start
  const arrayMatch = content.match(/=\s*\[/);
  if (!arrayMatch) return metadata;

  let i = arrayMatch.index + arrayMatch[0].length;

  while (i < content.length) {
    // Skip whitespace and commas
    while (i < content.length && /[\s,]/.test(content[i])) i++;

    // Check for array end
    if (content[i] === ']') break;

    // Look for object start
    if (content[i] === '{') {
      const endIndex = findMatchingBrace(content, i);
      if (endIndex === -1) break;

      const objStr = content.slice(i, endIndex + 1);
      const meta = extractFromObject(objStr);
      if (meta) {
        metadata.push(meta);
      }

      i = endIndex + 1;
    } else {
      i++;
    }
  }

  return metadata;
}

// Read main blogPosts.ts
const mainContent = fs.readFileSync(path.join(blogDir, 'blogPosts.ts'), 'utf-8');
const mainMeta = extractMetadata(mainContent);
console.log('Main posts:', mainMeta.length);

// Read specialized files
const specializedFiles = [
  'coreBlogPosts.ts',
  'webDevelopmentBlogPosts.ts',
  'ecommerceBlogPosts.ts',
  'brandingBlogPosts.ts',
  'aiAutomationBlogPosts.ts',
  'digitalMarketingBlogPosts.ts',
  'seoBlogPosts.ts',
  'socialMediaBlogPosts.ts',
  'contentMarketingBlogPosts.ts',
  'appDevelopmentBlogPosts.ts',
  'businessStrategyBlogPosts.ts',
  'chatbotBlogPosts.ts',
  'wordpress-blog-articles.ts'
];

let allMeta = [...mainMeta];

for (const file of specializedFiles) {
  const filePath = path.join(blogDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = extractMetadata(content);
    console.log(file + ':', meta.length);
    allMeta = allMeta.concat(meta);
  } else {
    console.log(file + ': not found');
  }
}

console.log('\nTotal posts:', allMeta.length);

// Check for issues
const issues = allMeta.filter(m => !m.category || m.category === 'כללי');
console.log('Posts with default category:', issues.length);
if (issues.length > 0 && issues.length <= 5) {
  console.log('Posts with issues:', issues.map(i => i.id));
}

const noImages = allMeta.filter(m => !m.image || m.image === '/images/blog/placeholder.webp');
console.log('Posts with placeholder image:', noImages.length);

// Generate the static metadata TypeScript file
const output = `// Auto-generated static blog metadata for listing pages
// This file contains ONLY metadata (no content) for better bundle performance
// Generated by scripts/extract-blog-meta.cjs
// Last generated: ${new Date().toISOString()}

export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  image: string;
  slug: string;
  date: string;
  featured?: boolean;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  tags?: string[];
}

export const blogPostsMeta: BlogPostMeta[] = ${JSON.stringify(allMeta, null, 2)};

// Helper function to get metadata by slug
export const getBlogPostMetaBySlug = (slug: string): BlogPostMeta | undefined => {
  return blogPostsMeta.find(post => post.slug === slug || post.id === slug);
};

// Helper function to get featured posts metadata
export const getFeaturedPostsMeta = (): BlogPostMeta[] => {
  return blogPostsMeta.filter(post => post.featured);
};

// Helper function to get posts metadata by category
export const getPostsMetaByCategory = (category: string): BlogPostMeta[] => {
  if (category === "הכל") return blogPostsMeta;
  return blogPostsMeta.filter(post => post.category === category);
};

// Get all unique categories
export const getAllCategoriesMeta = (): string[] => {
  const categories = new Set(blogPostsMeta.map(post => post.category));
  return ["הכל", ...Array.from(categories)];
};

// Pagination helper
export const POSTS_PER_PAGE = 12;

export const getPaginatedPostsMeta = (
  posts: BlogPostMeta[],
  page: number
): { posts: BlogPostMeta[]; totalPages: number; hasMore: boolean } => {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(start, end);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return {
    posts: paginatedPosts,
    totalPages,
    hasMore: page < totalPages
  };
};
`;

fs.writeFileSync(path.join(blogDir, 'blogPostsMeta.ts'), output);
console.log('\nGenerated blogPostsMeta.ts');
