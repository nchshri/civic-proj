'use client';

import { createPlatePlugin } from 'platejs/react';

import { FixedToolbar } from '@/src/components/ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/src/components/ui/fixed-toolbar-buttons';

export const FixedToolbarKit = [
  createPlatePlugin({
    key: 'fixed-toolbar',
    render: {
      beforeEditable: () => (
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
      ),
    },
  }),
];
