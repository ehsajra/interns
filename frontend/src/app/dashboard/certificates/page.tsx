'use client';

import { useEffect, useState } from 'react';
import { getUser, type User } from '@/lib/auth';
import { api } from '@/lib/api';

export default function CertificatesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
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

    const fetchCertificates = async () => {
      try {
        const response = await api.get('/intern/certificates');
        setCertificates(response.data);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
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

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Completed Internships</h1>
      {certificates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No completed internships yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{cert.project.title}</h2>
              <p className="text-gray-600 mb-4">{cert.project.shortDescription}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Completed: {new Date(cert.issuedAt).toLocaleDateString()}
                </span>
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download Certificate
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

