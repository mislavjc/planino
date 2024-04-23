import React, { ReactNode } from 'react';

import { cn } from 'lib/utils';

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

export const TypographyH1 = ({ children, className }: TypographyProps) => {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl tracking-tight lg:text-5xl',
        className,
      )}
    >
      {children}
    </h1>
  );
};

export const TypographyH2 = ({ children, className }: TypographyProps) => {
  return (
    <h2
      className={cn(
        'scroll-m-20 pb-2 text-3xl tracking-tight first:mt-0',
        className,
      )}
    >
      {children}
    </h2>
  );
};

export const TypographyH3 = ({ children, className }: TypographyProps) => {
  return (
    <h3 className={cn('scroll-m-20 text-2xl tracking-tight', className)}>
      {children}
    </h3>
  );
};

export const TypographyH4 = ({ children, className }: TypographyProps) => {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h4>
  );
};

export const TypographyP = ({ children, className }: TypographyProps) => {
  return <p className={cn('leading-7', className)}>{children}</p>;
};

export const TypographyList = ({ children, className }: TypographyProps) => {
  return (
    <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}>
      {children}
    </ul>
  );
};
