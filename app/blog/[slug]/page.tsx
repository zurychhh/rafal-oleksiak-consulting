import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPosts } from '@/lib/blog/blog-api';
import type { Metadata } from 'next';
import styles from '../blog.module.css';

// Awaria backendu (Railway) nie moze dawac 500 z „Application error” (audyt 22.11).
async function loadPost(slug: string) {
  try {
    return { post: await getPostBySlug(slug), failed: false };
  } catch {
    return { post: null, failed: true };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { post, failed } = await loadPost(slug);
  if (!post) return { title: failed ? 'Article unavailable' : 'Post not found', robots: { index: false } };

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    // Bez tego artykul dziedziczylby kanoniczny '/blog' z layoutu i wypadal z indeksu.
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      images: ['/og.png'],
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at || undefined,
      url: `https://oleksiakconsulting.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { post, failed } = await loadPost(slug);

  if (failed) {
    return (
      <div className={styles.emptyBlog}>
        <p className={styles.emptyBlogTitle}>Article unavailable right now</p>
        <p className={styles.emptyBlogText}>Reload in a minute, or go back to the home page.</p>
        <Link href="/" className={styles.paginationBtn}>
          Home page
        </Link>
      </div>
    );
  }
  if (!post) notFound();

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: 'Rafał Oleksiak',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Oleksiak Consulting',
    },
    ...(post.keywords?.length && { keywords: post.keywords.join(', ') }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className={styles.articleBack}>
        ← Back to blog
      </Link>

      <article>
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <div className={styles.articleMeta}>
            {publishedDate && <span>{publishedDate}</span>}
            <span>{post.word_count} words</span>
            {post.readability_score && (
              <span>Readability: {post.readability_score}/100</span>
            )}
          </div>
        </header>

        <div
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.keywords && post.keywords.length > 0 && (
          <div className={styles.articleKeywords}>
            {post.keywords.map((kw) => (
              <span key={kw} className={styles.keyword}>{kw}</span>
            ))}
          </div>
        )}
      </article>
    </>
  );
}
