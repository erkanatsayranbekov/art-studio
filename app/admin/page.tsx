'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaUsers, FaPalette, FaCalendarAlt } from 'react-icons/fa';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session.user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 ml-4">Users</h2>
            </div>
            <p className="text-gray-600">Manage user accounts and permissions</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              View Users →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <FaPalette className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 ml-4">Groups</h2>
            </div>
            <p className="text-gray-600">Manage art groups and classes</p>
            <button className="mt-4 text-purple-600 hover:text-purple-700 font-medium">
              View Groups →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-xl">
                <FaCalendarAlt className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 ml-4">Schedule</h2>
            </div>
            <p className="text-gray-600">Manage class schedules and timings</p>
            <button className="mt-4 text-green-600 hover:text-green-700 font-medium">
              View Schedule →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 