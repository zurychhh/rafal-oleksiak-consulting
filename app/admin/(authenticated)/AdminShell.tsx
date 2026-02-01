'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { UserResponse } from '@/lib/blog/types';
import styles from '../admin.module.css';

export function AdminShell({
  user,
  token,
  children,
}: {
  user: UserResponse;
  token: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin');
  }

  const isSuperadmin = user.role === 'superadmin';

  // Extract projectSlug from pathname (e.g., /admin/oleksiak-consulting/overview)
  const pathParts = pathname.split('/');
  const projectSlug = pathParts.length >= 3 && pathParts[1] === 'admin' && pathParts[2] !== 'dashboard'
    ? pathParts[2]
    : null;

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <p className={styles.sidebarLogo}>Blog Admin</p>
          <p className={styles.sidebarRole}>
            {user.email} ({user.role})
          </p>
        </div>

        <nav className={styles.sidebarNav}>
          {isSuperadmin && (
            <a
              href="/admin/dashboard"
              className={pathname === '/admin/dashboard' ? styles.navLinkActive : styles.navLink}
            >
              All Projects
            </a>
          )}
          {projectSlug && (
            <>
              <a
                href={`/admin/${projectSlug}/overview`}
                className={pathname.includes('/overview') ? styles.navLinkActive : styles.navLink}
              >
                Overview
              </a>
              <a
                href={`/admin/${projectSlug}/posts`}
                className={pathname.includes('/posts') ? styles.navLinkActive : styles.navLink}
              >
                Posts
              </a>
              <a
                href={`/admin/${projectSlug}/schedules`}
                className={pathname.includes('/schedules') ? styles.navLinkActive : styles.navLink}
              >
                Schedules
              </a>
            </>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sign out
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
