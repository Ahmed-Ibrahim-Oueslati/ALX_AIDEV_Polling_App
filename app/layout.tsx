
import { Metadata } from 'next';
import { cn } from '@/lib/utils';
import '@/app/globals.css';
import { AuthProvider } from '@/app/contexts/AuthContext';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'PollWave - Modern Polling Platform',
  description: 'Create, share, and analyze polls with our modern, intuitive platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans antialiased bg-gray-50">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-6">
                {children}
              </main>
            </div>
            <footer className="bg-white border-t border-gray-200 py-6 px-6">
              <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
                © 2025 PollWave. All rights reserved. Built with Next.js and Tailwind CSS.
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

