import { Body, Controller, Post } from '@nestjs/common';

import { EvaluationService } from './evaluation.service';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly svc: EvaluationService) {}

  @Post()
  evaluate(
    @Body()
    body: {
      topic: string;
      level: 'junior' | 'mid' | 'senior';
      normalized_text: string;
      unclear_segments: string[];
    },
  ) {
    return this.svc.evaluate(body);
  }
}
