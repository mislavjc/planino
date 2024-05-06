import Image from 'next/image';

import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { TypographyH1, TypographyP } from 'ui/typography';

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
        <div className="flex">
          <Input placeholder="Unesite svoj email" className="h-14" />
          <Button className="h-14 w-48">Primaj novosti</Button>
        </div>
      </div>
      <Image src={ExpensesPng} alt="Hero" className="border" />
    </div>
  );
};
