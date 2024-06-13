'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { templateConfig } from 'components/@navigation/config';
import { generateConfig } from 'components/@navigation/dashboard';
import { TypographyH3 } from 'components/ui/typography';

const OrganizationPage = () => {
  const { organization } = useParams();

  const config = generateConfig(organization as string, templateConfig);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <TypographyH3>Ulazni podatci</TypographyH3>
        <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {config.input.map((item) => {
            return (
              <Link href={item.href} key={item.href} className="border p-8">
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <TypographyH3>Izlazni podatci</TypographyH3>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {config.output.map((item) => {
            return (
              <Link href={item.href} key={item.href} className="border p-8">
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <TypographyH3>Dokumenti</TypographyH3>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {config.documents.map((item) => {
            return (
              <Link href={item.href} key={item.href} className="border p-8">
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
