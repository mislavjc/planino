'use client';

import { useEffect, useState } from 'react';
import { ProgressCircle } from '@planino/charts';
import { SelectBusinessPlan } from '@planino/database/schema';
import { generateText, JSONContent } from '@tiptap/core';

import { GradeBusinessPlan, gradeBusinessPlan } from 'actions/plans';

import { extensions } from 'components/editor/advanced-editor';
import { Button } from 'components/ui/button';
import {
  TypographyH3,
  TypographyH4,
  TypographyP,
} from 'components/ui/typography';

export const Rating = ({
  businessPlan,
}: {
  businessPlan: SelectBusinessPlan;
}) => {
  const text = generateText(businessPlan.content as JSONContent, extensions);

  const [grade, setGrade] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedGrade = localStorage.getItem('businessPlanGrade');
      return savedGrade ? JSON.parse(savedGrade) : null;
    }
    return null;
  });

  useEffect(() => {
    if (grade) {
      localStorage.setItem('businessPlanGrade', JSON.stringify(grade));
    }
  }, [grade]);

  return (
    <div>
      <Button
        onClick={async () => {
          const response = await gradeBusinessPlan({
            plan: text,
          });

          console.log(response);

          setGrade(response);
        }}
      >
        Ocjeni plan
      </Button>
      {grade && <BusinessPlanReviewComponent review={grade} />}
    </div>
  );
};

const sectionMap = {
  radnoIskustvo: {
    title: 'Radno Iskustvo',
    max: 15,
  },
  obrazovanjeIliDodatnaEdukacija: {
    title: 'Obrazovanje Ili Dodatna Edukacija',
    max: 15,
  },
  prvoPoduzetničkoIskustvo: {
    title: 'Prvo Poduzetničko Iskustvo',
    max: 5,
  },
  popunjenostISadržajPoslovnogPlana: {
    title: 'Popunjenost i Sadržaj Poslovnog Plana',
    max: 15,
  },
  indeksRazvijenosti: {
    title: 'Indeks Razvijenosti',
    max: 10,
  },
  procjenaPrihodaITroškova: {
    title: 'Procjena Prihoda i Troškova',
    max: 15,
  },
  dodatnePrednostiINedostatci: {
    title: 'Dodatne Prednosti i Nedostatci',
    max: 10,
  },
  inovativnostProjekta: {
    title: 'Inovativnost Projekta',
    max: 5,
  },
  ulaganjeUNedovoljnoRazvijenuDjelatnost: {
    title: 'Ulaganje u Nedovoljno Razvijenu Djelatnost',
    max: 5,
  },
} satisfies {
  [_key in keyof GradeBusinessPlan]: {
    title: string;
    max: number;
  };
};

type SectionReview = {
  ocjena: number;
  povratnaInformacija: string;
  savjetiZaPoboljšanje: string;
};

const SectionDisplay = ({
  title,
  max,
  section,
}: {
  title: string;
  max: number;
  section: SectionReview;
}) => {
  const percent = (section.ocjena / max) * 100;
  const variant =
    percent >= 80 ? 'success' : percent >= 50 ? 'warning' : 'error';

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex justify-center">
          <ProgressCircle value={percent} max={100} variant={variant}>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {section.ocjena}/{max}
            </span>
          </ProgressCircle>
        </div>
        <div>
          <TypographyH4>{title}</TypographyH4>
        </div>
      </div>

      <TypographyP>
        <strong>Povratna Informacija:</strong> {section.povratnaInformacija}
      </TypographyP>
      <TypographyP>
        <strong>Savjeti za Poboljšanje:</strong> {section.savjetiZaPoboljšanje}
      </TypographyP>
    </div>
  );
};

const BusinessPlanReviewComponent = ({
  review,
}: {
  review: GradeBusinessPlan;
}) => (
  <div className="flex flex-col gap-4">
    <TypographyH3>Pregled Poslovnog Plana</TypographyH3>
    {Object.keys(review).map((key) => (
      <SectionDisplay
        key={key}
        title={sectionMap[key as keyof GradeBusinessPlan].title}
        max={sectionMap[key as keyof GradeBusinessPlan].max}
        section={review[key as keyof GradeBusinessPlan]}
      />
    ))}
  </div>
);
