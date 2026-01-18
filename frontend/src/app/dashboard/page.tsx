'use client';

import { useEffect, useState } from 'react';
import { getUser, type User } from '@/lib/auth';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
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
    if (userLoading || !user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        let response;
        if (user.role === 'INTERN') {
          response = await api.get('/intern/profile');
        } else if (user.role === 'GUIDE') {
          response = await api.get('/guide/profile');
        } else {
          setLoading(false);
          return;
        }
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, userLoading]);

  if (userLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (user.role === 'ADMIN') {
    return (
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/guides"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">Manage Guides</h2>
            <p className="text-gray-600">Create and manage guide accounts</p>
          </Link>
          <Link
            href="/dashboard/projects"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">Projects Overview</h2>
            <p className="text-gray-600">View and manage all projects</p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      {profile && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg">
                {profile.firstName} {profile.lastName}
              </p>
            </div>
            {profile.bio && (
              <div>
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Skills</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.expertise && profile.expertise.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Expertise</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.expertise.map((exp: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-4">
              <Link
                href="/dashboard/profile/edit"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

