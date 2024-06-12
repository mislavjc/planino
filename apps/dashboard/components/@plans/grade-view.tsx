import { ProgressCircle } from '@planino/charts';
import { DeepPartial } from 'ai';

import { GradeBusinessPlan, PartialGradeBusinessPlan } from 'actions/plans';

import { TypographyH4, TypographyP } from 'ui/typography';

export const GradeView = ({ grade }: { grade?: PartialGradeBusinessPlan }) => (
  <div className="mt-8">
    {grade?.grades &&
      grade.grades.map(
        (section, index) =>
          section && (
            <SectionDisplay
              key={index}
              name={section.name}
              max={section.max}
              grade={section.grade}
              feedback={section.feedback}
              improvements={section.improvements}
            />
          ),
      )}
  </div>
);

type SectionReview = DeepPartial<GradeBusinessPlan['grades'][number]>;

const SectionDisplay = ({
  name,
  max,
  grade,
  feedback,
  improvements,
}: SectionReview) => {
  const percent = grade && max ? (grade / max) * 100 : 0;
  const variant =
    percent >= 80 ? 'success' : percent >= 50 ? 'warning' : 'error';

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex justify-center">
          <ProgressCircle value={percent} max={100} variant={variant}>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {grade}/{max}
            </span>
          </ProgressCircle>
        </div>
        <div>
          <TypographyH4>{name}</TypographyH4>
        </div>
      </div>

      <TypographyP>
        <strong>Povratna Informacija:</strong> {feedback}
      </TypographyP>
      <TypographyP>
        <strong>Savjeti za Poboljšanje:</strong> {improvements}
      </TypographyP>
    </div>
  );
};
