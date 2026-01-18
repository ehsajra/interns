'use client';

import { useEffect, useState } from 'react';
import { getUser, type User } from '@/lib/auth';
import { api } from '@/lib/api';

export default function GuidesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to get user:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userLoading || !user || user.role !== 'ADMIN') {
      setLoading(false);
      return;
    }

    const fetchGuides = async () => {
      try {
        const response = await api.get('/admin/guides');
        setGuides(response.data);
      } catch (error) {
        console.error('Failed to fetch guides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [user, userLoading]);

  if (userLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <div className="px-4 py-6">Access denied</div>;
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Manage Guides</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projects
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guides.map((guide) => (
              <tr key={guide.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {guide.firstName} {guide.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{guide.user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{guide._count.projects}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      guide.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {guide.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={async () => {
                      try {
                        await api.patch(`/admin/guides/${guide.id}/status`, {
                          isActive: !guide.isActive,
                        });
                        setGuides(
                          guides.map((g) =>
                            g.id === guide.id ? { ...g, isActive: !g.isActive } : g
                          )
                        );
                      } catch (error) {
                        console.error('Failed to update guide status:', error);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {guide.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

