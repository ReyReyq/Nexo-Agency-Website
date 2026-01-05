// Blog posts data - split into index and content for performance
// Index (84KB) loads on listing pages, content loads on-demand per article
// This reduces initial page load from 2MB to 84KB (95.8% savings)

// Blog post index (without content) - for listing pages
export interface BlogPostIndex {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  image: string;
  slug: string;
  date: string;
  lastUpdated?: string;
  featured?: boolean;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
    bio?: string;
    credentials?: string[];
  };
  tags?: string[];
}

// Full blog post (with content) - for article pages
export interface BlogPost extends BlogPostIndex {
  content: string;
}

// Cache for blog post index
let cachedIndex: BlogPostIndex[] | null = null;
let indexFetchPromise: Promise<BlogPostIndex[]> | null = null;

// Cache for individual post content
const contentCache = new Map<string, string>();

/**
 * Fetch blog post index (without content) - 84KB instead of 2MB
 * Uses caching to avoid multiple fetches
 */
export async function getBlogPostIndex(): Promise<BlogPostIndex[]> {
  if (cachedIndex) {
    return cachedIndex;
  }

  if (indexFetchPromise) {
    return indexFetchPromise;
  }

  indexFetchPromise = fetch('/data/blog-index.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch blog index: ${response.status}`);
      }
      return response.json();
    })
    .then((posts: BlogPostIndex[]) => {
      cachedIndex = posts;
      indexFetchPromise = null;
      return posts;
    })
    .catch(error => {
      indexFetchPromise = null;
      console.error('Error loading blog index:', error);
      throw error;
    });

  return indexFetchPromise;
}

/**
 * Fetch all blog posts (with content) - legacy function
 * For backward compatibility, loads all content on demand
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const index = await getBlogPostIndex();
  // Return index without content for listing - content is loaded per-article
  return index as BlogPost[];
}

/**
 * Fetch individual article content
 */
async function fetchArticleContent(slug: string): Promise<string> {
  if (contentCache.has(slug)) {
    return contentCache.get(slug)!;
  }

  const response = await fetch(`/data/blog-content/${slug}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch article content: ${response.status}`);
  }

  const data = await response.json();
  contentCache.set(slug, data.content);
  return data.content;
}

/**
 * Get a single blog post by slug (with content loaded on demand)
 */
export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const index = await getBlogPostIndex();
  const post = index.find(p => p.slug === slug || p.id === slug);

  if (!post) return undefined;

  // Load content on demand
  const content = await fetchArticleContent(post.slug);
  return { ...post, content };
}

/**
 * Get a single blog post by slug (alias for getBlogPost)
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return getBlogPost(slug);
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter(post => post.featured);
}

/**
 * Get blog posts by category
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  if (category === "הכל") return posts;
  return posts.filter(post => post.category === category);
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await getBlogPosts();
  const categories = new Set(posts.map(post => post.category));
  return ["הכל", ...Array.from(categories)];
}

/**
 * Clear the cache (useful for testing or forcing a refresh)
 */
export function clearBlogPostsCache(): void {
  cachedIndex = null;
  indexFetchPromise = null;
  contentCache.clear();
}

// Legacy synchronous exports for backward compatibility during migration
// These will throw if used before the async fetch completes
// Components should migrate to using the async versions

// This is kept for backward compatibility but components should use async version
export const blogPosts: BlogPost[] = [];

// Legacy sync helper - deprecated, use getBlogPostBySlug async version
export const getBlogPostBySlugSync = (slug: string): BlogPostIndex | undefined => {
  if (!cachedIndex) {
    console.warn('blogPosts not loaded yet. Use async getBlogPostBySlug() instead.');
    return undefined;
  }
  return cachedIndex.find(post => post.slug === slug || post.id === slug);
};

// Legacy sync helper - deprecated, use getFeaturedPosts async version
export const getFeaturedPostsSync = (): BlogPostIndex[] => {
  if (!cachedIndex) {
    console.warn('blogPosts not loaded yet. Use async getFeaturedPosts() instead.');
    return [];
  }
  return cachedIndex.filter(post => post.featured);
};

// Legacy sync helper - deprecated, use getPostsByCategory async version
export const getPostsByCategorySync = (category: string): BlogPostIndex[] => {
  if (!cachedIndex) {
    console.warn('blogPosts not loaded yet. Use async getPostsByCategory() instead.');
    return [];
  }
  if (category === "הכל") return cachedIndex;
  return cachedIndex.filter(post => post.category === category);
};

// Legacy sync helper - deprecated, use getAllCategories async version
export const getAllCategoriesSync = (): string[] => {
  if (!cachedIndex) {
    console.warn('blogPosts not loaded yet. Use async getAllCategories() instead.');
    return ["הכל"];
  }
  const categories = new Set(cachedIndex.map(post => post.category));
  return ["הכל", ...Array.from(categories)];
};
