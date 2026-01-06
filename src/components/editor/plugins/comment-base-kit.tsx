import { BaseCommentPlugin } from '@platejs/comment';

import { CommentLeafStatic } from '@/src/components/ui/comment-node-static';

export const BaseCommentKit = [
  BaseCommentPlugin.withComponent(CommentLeafStatic),
];
