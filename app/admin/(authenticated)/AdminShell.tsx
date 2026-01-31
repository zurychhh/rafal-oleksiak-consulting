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
          <a
            href="/admin/dashboard"
            className={pathname === '/admin/dashboard' ? styles.navLinkActive : styles.navLink}
          >
            Dashboard
          </a>
          {isSuperadmin && (
            <a
              href="/admin/dashboard"
              className={styles.navLink}
            >
              All Projects
            </a>
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
