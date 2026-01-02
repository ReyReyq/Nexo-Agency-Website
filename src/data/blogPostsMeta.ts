// Blog metadata for listing pages
// This file auto-generates metadata from blogPosts for better bundle performance
// The Blog listing page uses this lightweight metadata instead of full content

import { blogPosts, type BlogPost } from './blogPosts';

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

// Auto-generate metadata from full blog posts (strips content for performance)
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

// Export all blog posts metadata (auto-generated from blogPosts)
export const blogPostsMeta: BlogPostMeta[] = blogPosts.map(extractMeta);

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
