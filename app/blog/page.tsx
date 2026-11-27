import Link from 'next/link';
import { getPosts } from '@/lib/blog/blog-api';
import styles from './blog.module.css';
import type { PostListResponse } from '@/lib/blog/types';

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  // Backend bloga stoi osobno (Railway). Jego awaria nie moze dawac 500 z
  // „Application error” (audyt 22.11) — pokazujemy stan pusty z jednym zdaniem.
  let data: PostListResponse;
  let failed = false;
  try {
    data = await getPosts(page, 12);
  } catch {
    failed = true;
    data = { items: [], total: 0, page, page_size: 12, total_pages: 0 };
  }

  return (
    <>
      <h1 className={styles.blogTitle}>Blog</h1>
      <p className={styles.blogSubtitle}>
        Insights on ecommerce, conversion optimization, and marketing automation
      </p>

      {data.items.length === 0 ? (
        <div className={styles.emptyBlog}>
          <p className={styles.emptyBlogTitle}>{failed ? 'Articles unavailable right now' : 'Coming soon'}</p>
          <p className={styles.emptyBlogText}>
            {failed
              ? 'Reload in a minute, or go back to the home page.'
              : 'We are preparing our first articles. Check back soon.'}
          </p>
          {failed && (
            <Link href="/" className={styles.paginationBtn}>
              Home page
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className={styles.postGrid}>
            {data.items.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={styles.postCard}
              >
                <h2 className={styles.postCardTitle}>{post.title}</h2>
                <p className={styles.postCardExcerpt}>
                  {post.excerpt || post.meta_description || ''}
                </p>
                <div className={styles.postCardMeta}>
                  <span className={styles.postCardDate}>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : ''}
                  </span>
                  <span className={styles.readMore}>Read more →</span>
                </div>
              </Link>
            ))}
          </div>

          {data.total_pages > 1 && (
            <div className={styles.pagination}>
              {page > 1 && (
                <Link href={`/blog?page=${page - 1}`} className={styles.paginationBtn}>
                  ← Previous
                </Link>
              )}
              {Array.from({ length: data.total_pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  className={p === page ? styles.paginationBtnActive : styles.paginationBtn}
                >
                  {p}
                </Link>
              ))}
              {page < data.total_pages && (
                <Link href={`/blog?page=${page + 1}`} className={styles.paginationBtn}>
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
