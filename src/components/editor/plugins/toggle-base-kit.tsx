import { BaseTogglePlugin } from '@platejs/toggle';

import { ToggleElementStatic } from '@/src/components/ui/toggle-node-static';

export const BaseToggleKit = [
  BaseTogglePlugin.withComponent(ToggleElementStatic),
];
