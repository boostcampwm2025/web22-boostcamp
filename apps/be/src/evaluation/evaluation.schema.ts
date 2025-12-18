import { z } from 'zod';

export const EvaluationResultSchema = z.object({
  topic: z.string(),
  level: z.string(),
  keyword_hits: z.record(z.string(), z.boolean()),
  score: z.object({
    overall: z.number(),
    concept_understanding: z.number(),
    terminology_accuracy: z.number(),
    clarity: z.number(),
  }),
  issues: z.array(
    z.object({
      type: z.enum(['missing_required', 'misconception', 'unclear_expression', 'structure_issue']),
      id: z.string(),
      detail: z.string(),
      evidence: z.string().default(''),
    }),
  ),
  summary: z.string(),
  fix_suggestions: z.array(z.string()),
  followup_questions: z.array(z.string()),
});

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
