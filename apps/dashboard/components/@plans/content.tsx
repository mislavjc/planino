'use client';

import { useState } from 'react';
import { JSONContent } from 'novel';

import Editor from 'components/editor/advanced-editor';

import { defaultValue } from './default-value';

export const Content = () => {
  const [value, setValue] = useState<JSONContent>(defaultValue);
  return (
    <div className="mx-auto max-w-screen-lg">
      <Editor initialValue={value} onChange={setValue} />
    </div>
  );
};
