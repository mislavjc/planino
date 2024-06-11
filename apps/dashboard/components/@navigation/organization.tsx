import { Settings } from 'lucide-react';
import Link from 'next/link';

import { getOrganization } from 'actions/organization';

import { Button } from 'ui/button';
import { TypographyP } from 'ui/typography';

export const Organization = async ({ org }: { org: string }) => {
  const organization = await getOrganization(org);

  return (
    <div className="flex items-center justify-between gap-2 border bg-white p-2">
      <div className="flex items-center gap-2">
        <div className="bg-muted flex size-10 items-center justify-center border text-xl uppercase">
          {organization.name[0]}
        </div>
        <div>
          <TypographyP className="text-xs text-neutral-500">
            Organizacija
          </TypographyP>
          <TypographyP className="text-sm">{organization.name}</TypographyP>
        </div>
      </div>
      <Link href={`/${org}/postavke`}>
        <Button size="icon" variant="ghost">
          <Settings size={16} />
        </Button>
      </Link>
    </div>
  );
};
