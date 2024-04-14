import { SubmitButton } from './submit-button';

export const AddRow = ({ action }: { action: () => Promise<void> }) => {
  return (
    <form
      action={async () => {
        'use server';

        await action();
      }}
    >
      <SubmitButton />
    </form>
  );
};
