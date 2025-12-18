import { Injectable } from '@nestjs/common';

import { ClovaService } from '../clova/clova.service';
import { buildEvaluationPrompt } from './evaluation.prompt';
import { EvaluationResult, EvaluationResultSchema } from './evaluation.schema';
import { RubricLoader } from './rubric.loader';
import type { Level } from './rubric.types';

function safeJsonParse(text: string) {
  const trimmed = text.trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) throw new Error('Model output is not JSON');
  return JSON.parse(trimmed.slice(start, end + 1));
}

@Injectable()
export class EvaluationService {
  constructor(
    private readonly clova: ClovaService,
    private readonly rubricLoader: RubricLoader,
  ) {}

  async evaluate(input: {
    topic: string;
    level: Level;
    normalized_text: string;
    unclear_segments: string[];
  }): Promise<{ requestId: string; result: EvaluationResult }> {
    const rubric = this.rubricLoader.load(input.topic, input.level);

    const { system, user } = buildEvaluationPrompt({
      rubric,
      normalizedText: input.normalized_text,
      unclearSegments: input.unclear_segments ?? [],
    });

    const { requestId, content, raw } = await this.clova.chat(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      {
        // 평가 단계는 정규화보다 추론이 필요할 수 있음
        thinking: { effort: 'medium' },
        temperature: 0.2,
        maxCompletionTokens: 5000,
        stream: false,
      },
    );

    if (!content?.trim()) {
      throw new Error(
        `Empty model content (requestId=${requestId}) messageKeys=` +
          JSON.stringify(Object.keys(raw?.result?.message ?? {})),
      );
    }
    console.log('Model raw response:', raw); // 디버그용 전체 응답 로그
    const parsed = safeJsonParse(content);
    const result = EvaluationResultSchema.parse(parsed);

    return { requestId, result };
  }
}
