'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '@/src/components/ui/link-node';
import { LinkFloatingToolbar } from '@/src/components/ui/link-toolbar';

export const LinkKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
];
