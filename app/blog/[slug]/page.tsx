import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPosts } from '@/lib/blog/blog-api';
import type { Metadata } from 'next';
import styles from '../blog.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post not found' };

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
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
  const post = await getPostBySlug(slug);

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
