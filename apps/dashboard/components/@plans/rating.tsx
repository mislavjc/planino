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

const sectionTitles = {
  radnoIskustvo: 'Radno Iskustvo',
  obrazovanjeIliDodatnaEdukacija: 'Obrazovanje Ili Dodatna Edukacija',
  prvoPoduzetničkoIskustvo: 'Prvo Poduzetničko Iskustvo',
  popunjenostISadržajPoslovnogPlana: 'Popunjenost i Sadržaj Poslovnog Plana',
  indeksRazvijenosti: 'Indeks Razvijenosti',
  procjenaPrihodaITroškova: 'Procjena Prihoda i Troškova',
  dodatnePrednostiINedostatci: 'Dodatne Prednosti i Nedostatci',
  inovativnostProjekta: 'Inovativnost Projekta',
  ulaganjeUNedovoljnoRazvijenuDjelatnost:
    'Ulaganje u Nedovoljno Razvijenu Djelatnost',
} satisfies { [_key in keyof GradeBusinessPlan]: string };

type SectionReview = {
  ocjena: number;
  povratnaInformacija: string;
  savjetiZaPoboljšanje: string;
};

const SectionDisplay = ({
  title,
  section,
}: {
  title: string;
  section: SectionReview;
}) => (
  <div>
    <div className="flex items-center gap-4">
      <div className="flex justify-center">
        <ProgressCircle
          value={section.ocjena}
          max={15}
          variant={
            section.ocjena >= 10
              ? 'success'
              : section.ocjena >= 5
                ? 'warning'
                : 'error'
          }
        >
          <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {section.ocjena}/15
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
        title={sectionTitles[key as keyof GradeBusinessPlan]}
        section={review[key as keyof GradeBusinessPlan]}
      />
    ))}
  </div>
);
