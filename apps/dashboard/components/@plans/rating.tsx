'use client';

import { useState } from 'react';
import { SelectBusinessPlan } from '@planino/database/schema';
import { generateText, JSONContent } from '@tiptap/core';
import { readStreamableValue } from 'ai/rsc';

import { gradeBusinessPlan, PartialGradeBusinessPlan } from 'actions/plans';

import { extensions } from 'components/editor/advanced-editor';
import { Button } from 'components/ui/button';

import { GradeView } from './grade-view';

export const Rating = ({
  businessPlan,
}: {
  businessPlan: SelectBusinessPlan;
}) => {
  const text = generateText(businessPlan.content as JSONContent, extensions);
  const [generation, setGeneration] = useState<PartialGradeBusinessPlan>();
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div>
      <Button
        onClick={async () => {
          setIsGenerating(true);

          const { object } = await gradeBusinessPlan({
            plan: text,
          });

          for await (const partialObject of readStreamableValue<PartialGradeBusinessPlan>(
            object,
          )) {
            if (partialObject) {
              setGeneration(partialObject);
            }
          }

          setIsGenerating(false);
        }}
        disabled={isGenerating}
      >
        Ocjeni plan
      </Button>
      <GradeView grade={generation} />
    </div>
  );
};
