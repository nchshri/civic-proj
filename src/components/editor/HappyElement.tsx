'use client';

import { RenderElementProps } from 'slate-react';
import { getRandomQuote } from '@/src/lib/quotes';
import { QuotePopover } from '@/src/components/ui/quote-popover';
import { useState } from 'react';

export function HappyElement({ attributes, children }: RenderElementProps) {
  const [quote, setQuote] = useState(getRandomQuote('happy'));

  const handleClick = () => {
    setQuote(getRandomQuote('happy'));
  };

  return (
    <QuotePopover
      quote={quote}
      trigger={
        <span
          {...attributes}
          onClick={handleClick}
          className="inline cursor-pointer text-orange-600 font-semibold hover:bg-orange-50 px-1 rounded transition"
          contentEditable={false}
        >
          {children}
        </span>
      }
    />
  );
}