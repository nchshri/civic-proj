'use client';

import { RenderElementProps } from 'slate-react';
import { getRandomQuote } from '@/src/lib/quotes';
import { QuotePopover } from '@/src/components/ui/quote-popover';
import { useState } from 'react';

export function SadElement({ attributes, children }: RenderElementProps) {
  const [quote, setQuote] = useState(getRandomQuote('sad'));

  const handleClick = () => {
    setQuote(getRandomQuote('sad'));
  };

  return (
    <QuotePopover
      quote={quote}
      trigger={
        <span
          {...attributes}
          onClick={handleClick}
          className="inline cursor-pointer text-gray-600 font-semibold hover:bg-gray-100 px-1 rounded transition"
          contentEditable={false}
        >
          {children}
        </span>
      }
    />
  );
}