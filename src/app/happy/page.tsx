'use client';

import PlateEditor from '@/src/components/editor/plate-editor';

export default function HappyPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-yellow-600 mb-3">
            Happy Editor
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Transform text to sound happy! </p>
          <p className="text-sm text-gray-500 mt-2">
            (Use <code className="bg-yellow-100 px-2 py-1 rounded">/rewrite</code> to make your text happier)
          </p>
        </div>
        
        <PlateEditor 
            pageType="happy"
            storageKey="happy-editor-content"
          />
      </div>
    </div>
  );
}