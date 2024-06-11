import {
  organizations,
  organizationUsers,
  users,
} from '@planino/database/schema';
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
        <Link href="/registracija" className="ml-4 text-sm">
          <Button>
            Prijavi se
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  const result = await db
    .select()
    .from(organizations)
    .innerJoin(
      organizationUsers,
      eq(organizations.organizationId, organizationUsers.organizationId),
    )
    .innerJoin(users, eq(users.id, organizationUsers.userId));

  if (!result.length || !result[0].organization) {
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
    <Link href={`/${result[0].organization?.slug}`}>
      <Button>
        U aplikaciju
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </Link>
  );
};
