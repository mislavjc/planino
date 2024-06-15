import { Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

import { getBusinessPlan } from 'actions/plans';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'ui/breadcrumb';
import { Button } from 'ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from 'ui/drawer';

import { EditorBlock } from 'components/@plans/content';
import { Rating } from 'components/@plans/rating';
import { ScrollArea } from 'components/ui/scroll-area';

export const runtime = 'nodejs';

const BusinessPlanPage = async ({
  params: { businessPlanId, organization },
}: {
  params: {
    businessPlanId: string;
    organization: string;
  };
}) => {
  const businessPlan = await getBusinessPlan({
    organization,
    businessPlanId,
  });

  if (!businessPlan) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <div />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${organization}`}>Početna</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${organization}/poslovni-planovi`}>
                Poslovni planovi
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {businessPlan.name ?? 'Bez imena'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex gap-2 self-end">
              <Sparkles />
              <span>Ocjeni plan</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="left-auto right-0 top-0 mt-0 h-screen w-full max-w-lg rounded-none">
            <ScrollArea className="h-screen">
              <div className="mx-auto w-full">
                <DrawerHeader>
                  <DrawerTitle>Ocjenjivanje poslovnog plana</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <Rating businessPlan={businessPlan} />
                </div>
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="mx-auto flex min-h-screen w-full max-w-screen-lg flex-col gap-8 border p-8 md:p-16">
        <EditorBlock businessPlan={businessPlan} organization={organization} />
      </div>
    </div>
  );
};

export default BusinessPlanPage;
