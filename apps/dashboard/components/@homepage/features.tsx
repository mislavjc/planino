import Image from 'next/image';

import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from 'components/ui/typography';

import ExpensesGraphPng from 'public/images/expenses-graph.png';
import ExpensesTablePng from 'public/images/expenses-table.png';
import LoansGraphPng from 'public/images/loans-graph.png';
import RichTextPng from 'public/images/rich-text.png';

const content = [
  {
    title: 'Izrada poslovnih planova',
    description:
      'Planino omogućava izradu poslovnih planova na jednostavan način. Pomoću bogatog editora možete dodavati tekst, tablice, slike i još mnogo toga.',
    image: RichTextPng,
  },
  {
    title: 'Praćenje troškova',
    description:
      'Planino omogućava praćenje troškova na jednostavan način. Pomoću tablice možete dodavati troškove i pratiti ukupne troškove.',
    image: ExpensesTablePng,
  },
  {
    title: 'Analiza troškova',
    description:
      'Planino omogućava analizu troškova na jednostavan način. Pomoću grafova možete vizualizirati troškove i donositi informirane odluke.',
    image: ExpensesGraphPng,
  },
  {
    title: 'Analiza kredita',
    description:
      'Planino omogućava analizu kredita na jednostavan način. Pomoću grafova možete vizualizirati kredite i donositi informirane odluke.',
    image: LoansGraphPng,
  },
];

export const Features = () => {
  return (
    <div className="flex flex-col gap-4">
      <TypographyH2 className="text-center">Značajke</TypographyH2>
      <div className="grid gap-12 lg:grid-cols-2">
        {content.map((feature, index) => (
          <div key={index} className="mx-auto flex max-w-md flex-col gap-4">
            <Image
              src={feature.image}
              alt={feature.title}
              className="w-full border"
            />
            <div className="flex flex-col gap-2">
              <TypographyH3 className="text-xl text-neutral-800">
                {feature.title}
              </TypographyH3>
              <TypographyP className="text-base text-neutral-600">
                {feature.description}
              </TypographyP>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
