'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';

interface QuotePopoverProps {
  trigger: React.ReactNode;
  quote: string;
}

export function QuotePopover({ trigger, quote }: QuotePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="max-w-xs text-sm italic">
        “{quote}”
      </PopoverContent>
    </Popover>
  );
}