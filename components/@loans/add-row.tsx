'use client';

import { useFormStatus } from 'react-dom';
import { createLoan } from 'actions/loan';
import { Loader2, Plus } from 'lucide-react';

import { Button } from 'ui/button';

export const AddRow = ({ organization }: { organization: string }) => {
  return (
    <form
      action={async () => {
        createLoan(organization);
      }}
    >
      <SubmitButton />
    </form>
  );
};

const SubmitButton = () => {
  const status = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full border"
      variant="secondary"
      disabled={status.pending}
    >
      {status.pending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Plus size={16} />
      )}
    </Button>
  );
};