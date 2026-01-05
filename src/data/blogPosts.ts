// Blog posts data - externalized to JSON for better performance
// The blog content is loaded from /data/blog-posts.json at runtime
// This reduces the initial JS bundle size significantly

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
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

// Cache for blog posts
let cachedPosts: BlogPost[] | null = null;
let fetchPromise: Promise<BlogPost[]> | null = null;

/**
 * Fetch all blog posts from the JSON file
 * Uses caching to avoid multiple fetches
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  // Return cached data if available
  if (cachedPosts) {
    return cachedPosts;
  }

  // Return existing promise if a fetch is in progress
  if (fetchPromise) {
    return fetchPromise;
  }

  // Start new fetch
  fetchPromise = fetch('/data/blog-posts.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status}`);
      }
      return response.json();
    })
    .then((posts: BlogPost[]) => {
      cachedPosts = posts;
      fetchPromise = null;
      return posts;
    })
    .catch(error => {
      fetchPromise = null;
      console.error('Error loading blog posts:', error);
      throw error;
    });

  return fetchPromise;
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug || post.id === slug);
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
  cachedPosts = null;
  fetchPromise = null;
}

// Legacy synchronous exports for backward compatibility during migration
// These will throw if used before the async fetch completes
// Components should migrate to using the async versions

// This is kept for backward compatibility but components should use async version
export const blogPosts: BlogPost[] = [];

// Legacy sync helper - deprecated, use getBlogPostBySlug async version
export const getBlogPostBySlugSync = (slug: string): BlogPost | undefined => {
  if (!cachedPosts) {
    console.warn('blogPosts not loaded yet. Use async getBlogPostBySlug() instead.');
    return undefined;
  }
  return cachedPosts.find(post => post.slug === slug || post.id === slug);
};

// Legacy sync helper - deprecated, use getFeaturedPosts async version
export const getFeaturedPostsSync = (): BlogPost[] => {
  if (!cachedPosts) {
    console.warn('blogPosts not loaded yet. Use async getFeaturedPosts() instead.');
    return [];
  }
  return cachedPosts.filter(post => post.featured);
};

// Legacy sync helper - deprecated, use getPostsByCategory async version
export const getPostsByCategorySync = (category: string): BlogPost[] => {
  if (!cachedPosts) {
    console.warn('blogPosts not loaded yet. Use async getPostsByCategory() instead.');
    return [];
  }
  if (category === "הכל") return cachedPosts;
  return cachedPosts.filter(post => post.category === category);
};

// Legacy sync helper - deprecated, use getAllCategories async version
export const getAllCategoriesSync = (): string[] => {
  if (!cachedPosts) {
    console.warn('blogPosts not loaded yet. Use async getAllCategories() instead.');
    return ["הכל"];
  }
  const categories = new Set(cachedPosts.map(post => post.category));
  return ["הכל", ...Array.from(categories)];
};
