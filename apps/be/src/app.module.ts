import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AssessModule } from './assess/assess.module';
import { ClovaModule } from './clova/clova.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { SpeechNormalizeModule } from './speech-normalize/speech-normalize.module';
import { SpeechModule } from './speech/speech.module';

@Module({
  imports: [
    ClovaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SpeechNormalizeModule,
    EvaluationModule,
    AssessModule,
    SpeechModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
