'use client';

import PlateEditor from '@/src/components/editor/PlateEditor';

export default function SadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-slate-100">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-700 mb-3">
            Sad Editor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform text to sound sad.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            (Use <code className="bg-gray-200 px-2 py-1 rounded">/rewrite</code> to make your text sadder)
          </p>
        </div>
        
        <PlateEditor 
            pageType="sad"
            storageKey="sad-editor-content"
          />
      </div>
    </div>
  );
}