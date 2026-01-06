import { BaseLinkPlugin } from '@platejs/link';

import { LinkElementStatic } from '@/src/components/ui/link-node-static';

export const BaseLinkKit = [BaseLinkPlugin.withComponent(LinkElementStatic)];
