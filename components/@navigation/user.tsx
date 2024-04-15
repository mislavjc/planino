import { auth, signOut } from 'auth';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { TypographyP } from 'ui/typography';

import { Button } from 'components/ui/button';

export const User = async () => {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <div className="flex justify-between gap-2 border bg-white p-2">
      <div className="flex items-center gap-2">
        <div>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User profile image'}
              width={40}
              height={40}
            />
          )}
        </div>
        <div>
          <TypographyP className="text-sm text-neutral-700">
            {session.user.name || 'User'}
          </TypographyP>
          <TypographyP className="text-xs text-neutral-500">
            {session.user.email}
          </TypographyP>
        </div>
      </div>
      <form
        action={async () => {
          'use server';

          await signOut();
        }}
      >
        <Button variant="ghost" size="icon">
          <LogOut className="size-4" />
        </Button>
      </form>
    </div>
  );
};
