/*import { useState } from 'react';

interface UseAIProps {
  tone: 'happy' | 'sad';
}

interface UseAIReturn {
  rewriteText: (text: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function useAI({ tone }: UseAIProps): UseAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rewriteText = async (text: string): Promise<string> => {
    
    if (!text.trim()) {
      throw new Error('No text to rewrite');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          tone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      setIsLoading(false);
      
      if (!data.text) {
        return '';
      }
      
      return data.text;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to rewrite text';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  return { rewriteText, isLoading, error };
}*/