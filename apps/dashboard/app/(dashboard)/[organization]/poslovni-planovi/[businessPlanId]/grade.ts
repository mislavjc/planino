import { DeepPartial } from 'ai';
import { z } from 'zod';

export const gradeSchema = z.object({
  grades: z.array(
    z.object({
      name: z.union([
        z.literal('Radno iskustvo'),
        z.literal('Obrazovanje ili dodatna edukacija'),
        z.literal('Prvo poduzetničko iskustvo'),
        z.literal('Popunjenost i sadržaj poslovnog plana'),
        z.literal('Indeks razvijenosti'),
        z.literal('Procjena prihoda i troškova'),
        z.literal('Dodatne prednosti i nedostatci'),
        z.literal('Inovativnost projekta'),
        z.literal('Ulaganje u nedovoljno razvijenu djelatnost'),
      ]),
      grade: z.number().int().min(0).max(15),
      max: z.number().int().min(0).max(15),
      feedback: z.string(),
      improvements: z.string(),
    }),
  ),
});

export type GradeBusinessPlan = z.infer<typeof gradeSchema>;
export type PartialGradeBusinessPlan = DeepPartial<typeof gradeSchema>;
