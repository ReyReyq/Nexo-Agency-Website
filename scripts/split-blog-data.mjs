#!/usr/bin/env node
/**
 * Split blog-posts.json into:
 * 1. blog-index.json - List data only (for blog listing pages)
 * 2. blog-content/{slug}.json - Individual article content
 *
 * This reduces initial page load from 2MB to ~50KB
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');

async function splitBlogData() {
  console.log('📝 Splitting blog-posts.json...\n');

  // Read original file
  const originalPath = path.join(DATA_DIR, 'blog-posts.json');
  const originalData = JSON.parse(await fs.readFile(originalPath, 'utf-8'));

  console.log(`Found ${originalData.length} blog posts`);

  // Create blog-content directory
  const contentDir = path.join(DATA_DIR, 'blog-content');
  await fs.mkdir(contentDir, { recursive: true });

  // Create index (without content)
  const blogIndex = originalData.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    category: post.category,
    tags: post.tags,
    date: post.date,
    lastUpdated: post.lastUpdated,
    readTime: post.readTime,
    author: post.author,
    featured: post.featured,
  }));

  // Write index file
  const indexPath = path.join(DATA_DIR, 'blog-index.json');
  await fs.writeFile(indexPath, JSON.stringify(blogIndex, null, 2));
  const indexSize = (await fs.stat(indexPath)).size;
  console.log(`\n✅ Created blog-index.json (${(indexSize / 1024).toFixed(1)} KB)`);

  // Write individual content files
  let totalContentSize = 0;
  for (const post of originalData) {
    const contentPath = path.join(contentDir, `${post.slug}.json`);
    const contentData = {
      slug: post.slug,
      content: post.content,
    };
    await fs.writeFile(contentPath, JSON.stringify(contentData));
    const fileSize = (await fs.stat(contentPath)).size;
    totalContentSize += fileSize;
  }

  console.log(`✅ Created ${originalData.length} content files in blog-content/`);
  console.log(`   Total content size: ${(totalContentSize / 1024).toFixed(1)} KB`);

  // Calculate savings
  const originalSize = (await fs.stat(originalPath)).size;
  console.log(`\n📊 Summary:`);
  console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Index only: ${(indexSize / 1024).toFixed(1)} KB`);
  console.log(`   Savings on initial load: ${((originalSize - indexSize) / 1024 / 1024).toFixed(2)} MB (${(((originalSize - indexSize) / originalSize) * 100).toFixed(1)}%)`);
}

splitBlogData().catch(console.error);
