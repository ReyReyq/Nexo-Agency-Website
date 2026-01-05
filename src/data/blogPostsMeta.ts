// Blog metadata for listing pages
// This file provides lightweight metadata for the blog listing page
// Full content is loaded on-demand for individual article pages

import { getBlogPosts, type BlogPost } from './blogPosts';

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

// Extract metadata from full blog post (strips content for performance)
const extractMeta = (post: BlogPost): BlogPostMeta => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  readTime: post.readTime,
  image: post.image,
  slug: post.slug,
  date: post.date,
  featured: post.featured,
  author: post.author ? {
    name: post.author.name,
    avatar: post.author.avatar,
    role: post.author.role
  } : undefined,
  tags: post.tags
});

// Cache for metadata
let cachedMeta: BlogPostMeta[] | null = null;
let metaFetchPromise: Promise<BlogPostMeta[]> | null = null;

/**
 * Fetch all blog posts metadata
 */
export async function getBlogPostsMeta(): Promise<BlogPostMeta[]> {
  if (cachedMeta) {
    return cachedMeta;
  }

  if (metaFetchPromise) {
    return metaFetchPromise;
  }

  metaFetchPromise = getBlogPosts()
    .then(posts => {
      cachedMeta = posts.map(extractMeta);
      metaFetchPromise = null;
      return cachedMeta;
    })
    .catch(error => {
      metaFetchPromise = null;
      throw error;
    });

  return metaFetchPromise;
}

/**
 * Get metadata by slug
 */
export async function getBlogPostMetaBySlug(slug: string): Promise<BlogPostMeta | undefined> {
  const meta = await getBlogPostsMeta();
  return meta.find(post => post.slug === slug || post.id === slug);
}

/**
 * Get featured posts metadata
 */
export async function getFeaturedPostsMeta(): Promise<BlogPostMeta[]> {
  const meta = await getBlogPostsMeta();
  return meta.filter(post => post.featured);
}

/**
 * Get posts metadata by category
 */
export async function getPostsMetaByCategory(category: string): Promise<BlogPostMeta[]> {
  const meta = await getBlogPostsMeta();
  if (category === "הכל") return meta;
  return meta.filter(post => post.category === category);
}

/**
 * Get all unique categories
 */
export async function getAllCategoriesMeta(): Promise<string[]> {
  const meta = await getBlogPostsMeta();
  const categories = new Set(meta.map(post => post.category));
  return ["הכל", ...Array.from(categories)];
}

// Pagination helper
export const POSTS_PER_PAGE = 12;

export interface PaginatedResult {
  posts: BlogPostMeta[];
  totalPages: number;
  hasMore: boolean;
}

/**
 * Get paginated posts metadata
 */
export function getPaginatedPostsMeta(
  posts: BlogPostMeta[],
  page: number
): PaginatedResult {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(start, end);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return {
    posts: paginatedPosts,
    totalPages,
    hasMore: page < totalPages
  };
}

/**
 * Clear the cache
 */
export function clearBlogMetaCache(): void {
  cachedMeta = null;
  metaFetchPromise = null;
}

// Legacy sync exports for backward compatibility
// Components should migrate to async versions

export const blogPostsMeta: BlogPostMeta[] = [];
