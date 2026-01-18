'use client';

import { useEffect, useState } from 'react';
import { getUser, type User } from '@/lib/auth';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function ProjectsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
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

    const fetchProjects = async () => {
      try {
        let response;
        if (user.role === 'GUIDE') {
          response = await api.get('/guide/projects');
        } else if (user.role === 'ADMIN') {
          response = await api.get('/admin/projects');
        } else {
          setLoading(false);
          return;
        }
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, userLoading]);

  if (userLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user || (user.role !== 'GUIDE' && user.role !== 'ADMIN')) {
    return <div className="px-4 py-6">Access denied</div>;
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {user.role === 'GUIDE' && (
          <Link
            href="/dashboard/projects/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Project
          </Link>
        )}
      </div>
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No projects yet</p>
          {user.role === 'GUIDE' && (
            <Link
              href="/dashboard/projects/new"
              className="mt-4 inline-block text-blue-600 hover:text-blue-500"
            >
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.shortDescription}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Status: {project.status}</span>
                <span>{project.durationWeeks} weeks</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

