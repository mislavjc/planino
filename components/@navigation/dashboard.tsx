'use client';

import Link from 'next/link';

import { TypographyP } from 'components/ui/typography';

import { cn } from 'lib/utils';

import { templateConfig } from './config';

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  children,
  active = false,
}) => (
  <Link
    href={href}
    className={cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 transition-all md:gap-4',
      {
        'bg-muted px-3 py-2 text-primary': active,
        'text-muted-foreground hover:text-primary': !active,
      },
    )}
  >
    {Icon}
    {children}
  </Link>
);

export const Navigation = () => {
  return (
    <nav className="grid gap-2 text-lg font-medium md:gap-3 md:text-sm lg:px-4">
      <TypographyP className="text-xs uppercase text-muted-foreground">
        Ulazni podatci
      </TypographyP>
      {templateConfig.input.map((item, index) => (
        <NavItem key={index} icon={item.icon} href={item.href}>
          {item.label}
        </NavItem>
      ))}
      <TypographyP className="text-xs uppercase text-muted-foreground">
        Izlazni podatci
      </TypographyP>
      {templateConfig.output.map((item, index) => (
        <NavItem key={index} icon={item.icon} href={item.href}>
          {item.label}
        </NavItem>
      ))}
    </nav>
  );
};
