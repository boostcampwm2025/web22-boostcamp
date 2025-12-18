import { Module } from '@nestjs/common';

import { SpeechNormalizeController } from './speech-normalize.controller';
import { SpeechNormalizeService } from './speech-normalize.service';
import { ClovaModule } from 'src/clova/clova.module';

@Module({
  imports: [ClovaModule],
  controllers: [SpeechNormalizeController],
  providers: [SpeechNormalizeService],
  exports: [SpeechNormalizeService],
})
export class SpeechNormalizeModule {}
