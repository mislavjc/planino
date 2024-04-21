'use client';

import { useFormStatus } from 'react-dom';
import { Loader2, Plus } from 'lucide-react';

import { FocusBorder } from './table/focus-border';
import { Button } from './ui/button';
import { TypographyP } from './ui/typography';

export const SubmitButton = () => {
  const status = useFormStatus();

  return (
    <Button
      type="submit"
      className="group relative flex w-full justify-start"
      variant="outline"
      disabled={status.pending}
      ring={false}
    >
      {status.pending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <div className="flex items-center gap-2">
          <Plus size={16} />
          <TypographyP>Dodaj redak</TypographyP>
        </div>
      )}
      <FocusBorder />
    </Button>
  );
};
