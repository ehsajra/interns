'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getUser, clearAuth } from '@/lib/auth';
import Link from 'next/link';
import type { User } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const userData = await getUser();
      if (!userData) {
        router.push('/login');
        return;
      }

      setUser(userData);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      } else if (session) {
        getUser().then(setUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await clearAuth();
    router.push('/login');
  };

  const getDashboardLinks = () => {
    switch (user.role) {
      case 'INTERN':
        return [
          { href: '/dashboard', label: 'My Profile' },
          { href: '/dashboard/applications', label: 'My Applications' },
          { href: '/dashboard/certificates', label: 'Completed Internships' },
        ];
      case 'GUIDE':
        return [
          { href: '/dashboard', label: 'My Profile' },
          { href: '/dashboard/projects', label: 'My Projects' },
        ];
      case 'ADMIN':
        return [
          { href: '/dashboard', label: 'Overview' },
          { href: '/dashboard/guides', label: 'Guides' },
          { href: '/dashboard/projects', label: 'Projects' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex items-center px-2 py-2 text-xl font-bold text-blue-600">
                Interns Project Hub
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {getDashboardLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

