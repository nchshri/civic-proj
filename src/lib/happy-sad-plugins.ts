import { createPlatePlugin } from 'platejs/react';
import { HappyElement } from '@/src/components/editor/HappyElement';
import { SadElement } from '@/src/components/editor/SadElement';
import { withHappySadTransform } from './transform';

export const HappyPlugin = createPlatePlugin({
  key: 'happy-text',
  node: {
    isElement: true,
    isInline: true,
    component: HappyElement,
  },
});

export const SadPlugin = createPlatePlugin({
  key: 'sad-text',
  node: {
    isElement: true,
    isInline: true,
    component: SadElement,
  },
});

export const HappySadTransformPlugin = createPlatePlugin({
  key: 'happySadTransform',
  // @ts-expect-error - Type mismatch between PlateEditor and Slate Editor
  extendEditor: withHappySadTransform,
});