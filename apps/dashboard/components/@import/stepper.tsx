'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'ui/breadcrumb';

const steps = [
  {
    name: 'Uvoz podataka',
    route: '/podatci/uvoz-podataka',
  },
  {
    name: 'Mapiranje stupaca',
    route: '/podatci/mapiranje-stupaca',
  },
  {
    name: 'Pregled vrijednosti',
    route: '/podatci/pregled-vrijednosti',
  },
  {
    name: 'Pregled uvoza',
    route: '/podatci/pregled-uvoza',
  },
];

export const Stepper = () => {
  const pathname = usePathname();

  const currentStep = steps.findIndex((step) => step.route === pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem key={index}>
              {index === currentStep ? (
                <BreadcrumbPage>{step.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={step.route} className="flex gap-1">
                  <span className="inline-flex size-5 items-center justify-center bg-black/90 text-white">
                    {index + 1}
                  </span>
                  {step.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < steps.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
