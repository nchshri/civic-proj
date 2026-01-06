'use client';

import { TogglePlugin } from '@platejs/toggle/react';

import { IndentKit } from '@/src/components/editor/plugins/indent-kit';
import { ToggleElement } from '@/src/components/ui/toggle-node';

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement),
];
