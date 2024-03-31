import React from 'react';
import { getOrganization } from 'actions/organization';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { Button } from 'ui/button';
import { Sheet, SheetContent, SheetTrigger } from 'ui/sheet';

import { Navigation } from 'components/@navigation/dashboard';

export const runtime = 'edge';

const OrganizationLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    organization: string;
  };
}>) => {
  const organization = await getOrganization(params.organization);

  return (
    <div>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="">{organization.name}</span>
              </Link>
            </div>
            <div className="flex-1 md:px-2">
              <Navigation />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <Navigation />
              </SheetContent>
            </Sheet>
          </header>
          <main className="flex max-w-[100vw] flex-1 flex-col gap-4 p-4 md:max-w-[calc(100vw-224px)] lg:max-w-[calc(100vw-284px)] lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrganizationLayout;
