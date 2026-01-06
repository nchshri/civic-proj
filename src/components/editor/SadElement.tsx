'use client';

import * as React from 'react';
import { PlateElement } from 'platejs/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { getRandomQuote } from '@/src/lib/quotes';
import { RenderElementProps } from 'platejs';

export function SadElement({ children, attributes, element }: RenderElementProps) {
  const [quote, setQuote] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setQuote(getRandomQuote('sad'));
    setOpen(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          {...attributes}
          className="cursor-pointer bg-blue-100 text-blue-800 px-1 rounded hover:bg-blue-200 transition"
          onClick={handleClick}
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Sad Quote</h4>
          <p className="text-sm text-gray-600">{quote}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}