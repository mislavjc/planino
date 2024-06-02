'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'ui/breadcrumb';

import { cn } from 'lib/utils';

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

const generateSteps = (organization: string | string[]) => {
  return steps.map((step) => ({
    ...step,
    route: `/${organization}${step.route}`,
  }));
};

export const Stepper = () => {
  const pathname = usePathname();
  const { organization } = useParams();

  const steps = generateSteps(organization);

  const currentStep = steps.findIndex((step) => step.route === pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === currentStep ? (
                <BreadcrumbPage className="flex gap-1">
                  <StepIndex index={index} currentStep={currentStep} />
                  {step.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={step.route} className="flex gap-1">
                  <StepIndex index={index} currentStep={currentStep} />
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

const StepIndex = ({
  index,
  currentStep,
}: {
  index: number;
  currentStep: number;
}) => (
  <span
    className={cn(
      'inline-flex size-5 items-center justify-center text-primary-foreground',
      {
        'bg-primary': index <= currentStep,
        'bg-muted text-primary': index > currentStep,
      },
    )}
  >
    {index + 1}
  </span>
);
