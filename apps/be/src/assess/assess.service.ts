import { Injectable } from '@nestjs/common';

import { EvaluationService } from '../evaluation/evaluation.service';
import { SpeechNormalizeService } from '../speech-normalize/speech-normalize.service';
import { AssessRequestDto, AssessResponseDto } from './assess.dto';

@Injectable()
export class AssessService {
  constructor(
    private readonly normalizeService: SpeechNormalizeService,
    private readonly evaluationService: EvaluationService,
  ) {}

  async assess(body: AssessRequestDto): Promise<AssessResponseDto> {
    // 1) Phase1: normalize
    const n = await this.normalizeService.normalize(body.sttText);

    // 2) Phase2: evaluate (틀린 개념은 여기서!)
    const e = await this.evaluationService.evaluate({
      topic: body.topic,
      level: body.level,
      normalized_text: n.result.normalized_text,
      unclear_segments: n.result.unclear_segments ?? [],
    });

    return {
      normalize: {
        requestId: n.requestId,
        normalized_text: n.result.normalized_text,
        unclear_segments: n.result.unclear_segments ?? [],
        confidence: n.result.confidence,
      },
      evaluation: {
        requestId: e.requestId,
        result: e.result,
      },
    };
  }
}
