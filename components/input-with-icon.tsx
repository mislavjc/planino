import { LucideIcon } from 'lucide-react';

import { Input, InputProps } from './ui/input';

export const InputWithIcon = ({
  icon: Icon,
  ...inputProps
}: {
  icon: LucideIcon;
} & InputProps) => {
  return (
    <div className="relative">
      <div className="absolute left-1 top-3 mr-4">
        <Icon size={16} />
      </div>
      <Input className="w-full" {...inputProps} />
    </div>
  );
};
