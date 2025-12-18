import { Module } from '@nestjs/common';

import { ClovaModule } from '../clova/clova.module';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { RubricLoader } from './rubric.loader';

@Module({
  imports: [ClovaModule],
  controllers: [EvaluationController],
  providers: [EvaluationService, RubricLoader],
  exports: [EvaluationService],
})
export class EvaluationModule {}
