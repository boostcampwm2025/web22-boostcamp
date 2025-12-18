import { z } from 'zod';

export const NormalizeResultSchema = z.object({
  normalized_text: z.string(),
  unclear_segments: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).optional(),
});

export type NormalizeResult = z.infer<typeof NormalizeResultSchema>;
