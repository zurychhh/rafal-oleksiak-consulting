import { redirect } from 'next/navigation';
import { getSession, getToken, isSuperadmin } from '@/lib/blog/session';
import { getTenants, getMyTenant, getAgents } from '@/lib/blog/admin-api';
import type { TenantResponse } from '@/lib/blog/types';
import Link from 'next/link';
import styles from '../../admin.module.css';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/admin');

  const token = (await getToken())!;

  // Superadmin sees all tenants; admin sees own tenant
  if (isSuperadmin(session)) {
    let tenants: TenantResponse[];
    try {
      tenants = await getTenants(token);
    } catch {
      tenants = [];
    }

    return (
      <>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Projects</h1>
        </div>

        {tenants.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateTitle}>No projects yet</p>
            <p className={styles.emptyStateText}>Create a tenant to get started.</p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {tenants.map((t) => (
              <Link
                key={t.id}
                href={`/admin/${t.slug}/posts`}
                className={styles.card}
              >
                <h2 className={styles.cardName}>{t.name}</h2>
                <p className={styles.cardSlug}>{t.slug}</p>
                <div className={styles.cardStats}>
                  <span className={styles.cardStat}>
                    Posts: <span className={styles.cardStatValue}>{t.posts_used}/{t.posts_limit}</span>
                  </span>
                  <span className={styles.cardStat}>
                    Tokens: <span className={styles.cardStatValue}>{t.tokens_used.toLocaleString()}/{t.tokens_limit.toLocaleString()}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </>
    );
  }

  // Admin: get agents for their tenant and redirect to first one
  try {
    const agents = await getAgents(token);
    if (agents.length > 0) {
      const tenant = await getMyTenant(token);
      redirect(`/admin/${tenant.slug}/posts`);
    }
  } catch {
    // fall through
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
      </div>
      <div className={styles.emptyState}>
        <p className={styles.emptyStateTitle}>No agents configured</p>
        <p className={styles.emptyStateText}>Contact your administrator to set up a blog agent.</p>
      </div>
    </>
  );
}
