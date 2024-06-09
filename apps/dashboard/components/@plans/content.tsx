'use client';

import { SelectBusinessPlan } from '@planino/database/schema';

import { updateBusinessPlan } from 'actions/plans';

import Editor from 'components/editor/advanced-editor';
import { JSONContentSchema } from 'components/editor/schema';

export const EditorBlock = ({
  businessPlan,
  organization,
}: {
  businessPlan: SelectBusinessPlan;
  organization: string;
}) => {
  if (businessPlan.content === null) {
    return (
      <Editor
        initialValue={undefined}
        onChange={(_value) => {
          updateBusinessPlan({
            businessPlanId: businessPlan.businessPlanId,
            content: JSON.stringify(_value),
            organization,
          });
        }}
      />
    );
  }

  const parsedContent = JSONContentSchema.parse(businessPlan.content);

  return (
    <Editor
      initialValue={parsedContent}
      onChange={(_value) => {
        updateBusinessPlan({
          businessPlanId: businessPlan.businessPlanId,
          content: JSON.stringify(_value),
          organization,
        });
      }}
    />
  );
};
