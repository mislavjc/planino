import { organizations } from '@planino/database/schema';
import { auth } from 'auth';
import { eq } from 'drizzle-orm';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { db } from 'db/drizzle';

import { Button } from 'components/ui/button';

export const Auth = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div>
        <Link href="/prijava" className="text-sm">
          Prijavi se
        </Link>
        <Link href="/registracija" className="ml-4 text-sm">
          <Button>
            Registriraj se
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.userId, session.user?.id ?? ''),
    columns: {
      name: true,
    },
  });

  if (!organization) {
    return (
      <Link href="/new">
        <Button>
          Kreiraj organizaciju
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </Link>
    );
  }

  return (
    <Link href={`/${organization?.name}`}>
      <Button>
        U aplikaciju
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </Link>
  );
};
