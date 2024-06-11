'use client';

import Link from 'next/link';
import { redirect, useParams, usePathname } from 'next/navigation';

import { TypographyP } from 'components/ui/typography';

import { cn } from 'lib/utils';

import { TemplateConfig, templateConfig } from './config';

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
};

const NavItem = ({ href, icon, children, active = false }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 transition-all md:gap-4 w-full border border-transparent',
      {
        'bg-white border border-border px-3 py-2 text-primary': active,
        'text-muted-foreground hover:text-primary': !active,
      },
    )}
  >
    {icon}
    {children}
  </Link>
);

const generateConfig = (name: string, config: TemplateConfig) => {
  return {
    input: config.input.map((item) => ({
      ...item,
      href: `/${name}${item.href}`,
    })),
    output: config.output.map((item) => ({
      ...item,
      href: `/${name}${item.href}`,
    })),
    documents: config.documents.map((item) => ({
      ...item,
      href: `/${name}${item.href}`,
    })),
  };
};

export const Navigation = ({
  user,
  org,
}: {
  user: React.ReactNode;
  org: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { organization } = useParams();

  const config = generateConfig(organization as string, templateConfig);

  const isInConfig =
    config.input.some((item) =>
      pathname.includes(item.href.replace(/\/$/, '')),
    ) ||
    config.output.some((item) =>
      pathname.includes(item.href.replace(/\/$/, '')),
    ) ||
    config.documents.some((item) =>
      pathname.includes(item.href.replace(/\/$/, '')),
    );

  const organizationPath = '/' + organization;
  const allowedPathsSuffixes = ['', '/postavke'];

  const allowedPaths = allowedPathsSuffixes.map(
    (suffix) => organizationPath + suffix,
  );

  const isNotInConfig = !isInConfig && !allowedPaths.includes(pathname);

  if (isNotInConfig) {
    redirect('/' + organization);
  }

  return (
    <nav className="relative grid gap-2 py-4 text-lg font-medium lg:fixed lg:w-[280px] lg:gap-3 lg:px-4 lg:text-sm">
      <div className="mb-4">{org}</div>
      <div className="flex max-h-[calc(100svh-12rem)] flex-col gap-2 overflow-y-auto">
        <TypographyP className="text-xs uppercase text-muted-foreground">
          Ulazni podatci
        </TypographyP>
        <div>
          {config.input.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              href={item.href}
              active={pathname.startsWith(item.href)}
            >
              {item.label}
            </NavItem>
          ))}
        </div>
        <TypographyP className="text-xs uppercase text-muted-foreground">
          Izlazni podatci
        </TypographyP>
        <div>
          {config.output.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              href={item.href}
              active={pathname.startsWith(item.href)}
            >
              {item.label}
            </NavItem>
          ))}
        </div>
        <TypographyP className="text-xs uppercase text-muted-foreground">
          Dokumenti
        </TypographyP>
        <div>
          {config.documents.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              href={item.href}
              active={pathname.startsWith(item.href)}
            >
              {item.label}
            </NavItem>
          ))}
        </div>
      </div>
      <div className="fixed bottom-4 lg:w-[280px]">{user}</div>
    </nav>
  );
};
