'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isAdminPage && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 