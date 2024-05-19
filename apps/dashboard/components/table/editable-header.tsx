import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { TableInput } from './input';

type EditableHeaderProps = {
  value: string;
  id: string;
  onChange: (_value: { id: string; value: string }) => Promise<void>;
};

export const EditableHeader = ({
  value,
  id,
  onChange,
}: EditableHeaderProps) => {
  const [stateValue, setStateValue] = useState(value);

  const debounceValueChange = useDebouncedCallback(async (value: string) => {
    await onChange({
      id,
      value,
    });
  }, 1_000);

  return (
    <TableInput
      value={stateValue}
      onChange={(e) => {
        setStateValue(e.target.value);
        debounceValueChange(e.target.value);
      }}
      inputClassName="bg-muted/60 px-4 py-2 font-mono text-sm uppercase"
    />
  );
};
