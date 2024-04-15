import React, { Suspense } from 'react';
import { Menu } from 'lucide-react';

import { Button } from 'ui/button';
import { Sheet, SheetContent, SheetTrigger } from 'ui/sheet';

import { Navigation } from 'components/@navigation/dashboard';
import { User } from 'components/@navigation/user';

export const runtime = 'edge';

const OrganizationLayout = ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    organization: string;
  };
}>) => {
  return (
    <div className="bg-muted">
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden md:block">
          <div className="flex-1 border-red-950 md:px-2">
            <Navigation
              user={
                <Suspense>
                  <User />
                </Suspense>
              }
            />
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted px-4 md:hidden lg:h-[60px] lg:px-6">
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
                <Navigation user={<User />} />
              </SheetContent>
            </Sheet>
          </header>
          <main className="m-4 flex max-w-[100vw] flex-1 flex-col gap-4 border bg-white p-4 md:max-w-[calc(100vw-224px)] lg:max-w-[calc(100vw-284px)] lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrganizationLayout;
