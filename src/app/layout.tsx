import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Civic Editor Project',
  description: 'AI-powered rich text editor with emotional rewriting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-cyan-700 border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="w-full mx-auto py-4">
            <div className="flex items-center justify-between">
              <h2 className="ml-4 text-2xl font-bold text-gray-800">
                <Link href="/">Civic Project</Link>
              </h2>
              
              <div className="flex text-sm text-gray-500 gap-1 mr-4">
                <Link 
                  href="/happy" 
                  className="px-4 py-2 rounded-2xl bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition font-medium"
                >
                  Happy
                </Link>
                <Link 
                  href="/sad" 
                  className="px-4 py-2 rounded-2xl bg-cyan-200 text-cyan-700 hover:bg-cyan-300 transition font-medium"
                >
                  Sad
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        {children}
      </body>
    </html>
  );
}