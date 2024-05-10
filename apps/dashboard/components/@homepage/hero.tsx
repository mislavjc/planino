import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from 'ui/button';
import { TypographyH1, TypographyP } from 'ui/typography';

import { CALCOM_URL } from 'lib/constants';

import ExpensesPng from 'public/images/expenses.png';

export const Hero = () => {
  return (
    <div className="mt-24 flex flex-col  items-center gap-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <TypographyH1 className="max-w-lg">
          Poslovno planiranje pojednostavljeno
        </TypographyH1>
        <TypographyP className="text-muted-foreground text-lg font-light lg:text-xl">
          Planino je aplikacija koja olakšava izradu poslovnih planova i
          praćenje troškova.
        </TypographyP>
        <Link href={CALCOM_URL} target="_blank">
          <Button className="h-14 w-48">
            Ugovorite demo
            <ArrowRight size={24} className="ml-2" />
          </Button>
        </Link>
      </div>
      <Image src={ExpensesPng} alt="Hero" className="border" />
    </div>
  );
};
