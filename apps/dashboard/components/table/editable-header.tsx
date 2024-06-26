import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { TableInput } from './input';

type EditableHeaderProps = {
  value: string;
  id: string;
  onChange: (_value: { id: string; value: string }) => Promise<void>;
  placeholder?: string;
};

export const EditableHeader = ({
  value,
  id,
  onChange,
  placeholder,
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
      inputClassName="px-4 border-x border-t py-2 font-mono text-sm uppercase"
      placeholder={placeholder}
    />
  );
};
