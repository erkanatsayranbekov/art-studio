'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { BsPeopleFill, BsCalendarCheck, BsPaletteFill } from 'react-icons/bs';
import { GiGraduateCap } from 'react-icons/gi';
import { BiSolidDashboard } from 'react-icons/bi';
import { MdHome } from 'react-icons/md';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  const navigation = [
    { name: 'Главная', href: '/', icon: MdHome, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Группы', href: '/groups', icon: BsPeopleFill, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'Ученики', href: '/students', icon: GiGraduateCap, color: 'text-green-600', bgColor: 'bg-green-100' },
    { name: 'Посещаемость', href: '/attendance', icon: BsCalendarCheck, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { name: 'Мастер Классы', href: '/master-classes', icon: BsPaletteFill, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  ];

  const adminNavigation = [
    ...navigation,
    { name: 'Админ Панель', href: '/admin', icon: BiSolidDashboard, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  ];

  const currentNavigation = session?.user?.role === 'admin' ? adminNavigation : navigation;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-[1000]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors duration-200"
        >
          {isOpen ? <FaTimes className="w-6 h-6 text-gray-500" /> : <FaBars className="w-6 h-6 text-gray-500" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[1000] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Art Studio</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {currentNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`p-2 rounded-xl ${item.bgColor} mr-3`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            {session ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 