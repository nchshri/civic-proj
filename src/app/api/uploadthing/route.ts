import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from '@/src/lib/upload-thing';

export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
