'use client';

import { useEffect, useState } from 'react';
import { getUser, type User } from '@/lib/auth';
import { api } from '@/lib/api';

export default function ApplicationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
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
    if (userLoading || !user || user.role !== 'INTERN') {
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await api.get('/intern/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, userLoading]);

  if (userLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user || user.role !== 'INTERN') {
    return <div className="px-4 py-6">Access denied</div>;
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-gray-100 text-gray-800';
      case 'SHORTLISTED':
        return 'bg-blue-100 text-blue-800';
      case 'OFFER':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No applications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{app.project.title}</h2>
                  <p className="text-gray-600 mb-2">Role: {app.role.title}</p>
                  <p className="text-sm text-gray-500">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                  {app.fitmentScore !== null && (
                    <p className="text-sm text-gray-500 mt-1">
                      Fitment Score: {app.fitmentScore.toFixed(1)}%
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

