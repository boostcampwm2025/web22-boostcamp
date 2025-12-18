import { Module } from '@nestjs/common';

import { EvaluationModule } from '../evaluation/evaluation.module';
import { SpeechNormalizeModule } from '../speech-normalize/speech-normalize.module';
import { AssessController } from './assess.controller';
import { AssessService } from './assess.service';

@Module({
  imports: [SpeechNormalizeModule, EvaluationModule],
  controllers: [AssessController],
  providers: [AssessService],
  exports: [AssessService],
})
export class AssessModule {}
