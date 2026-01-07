import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Civic Editor
        </h1>

        <p className="text-gray-600 text-center mb-8">
          AI-powered rich text editor with emotional tone rewriting and interactive elements
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Features:</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• AI tone rewriting with rewrite command from menu (Ctrl + J)</li>
            <li>• Interactive &apos;happy&apos; and &apos;sad&apos; clickable words</li>
            <li>• Auto-save with localStorage</li>
            <li>• Real-time editing with Plate.js</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/happy">
            <button className="w-full py-4 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition font-medium">
              Happy Editor
            </button>
          </Link>
          
          <Link href="/sad">
            <button className="w-full py-4 bg-cyan-200 text-cyan-700 hover:bg-cyan-300 transition font-medium">
              Sad Editor
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}