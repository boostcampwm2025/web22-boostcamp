import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AssessModule } from '../assess/assess.module';
import { ClovaSttProvider } from './provider/clova-stt.provider';
import { ObjectStorageProvider } from './provider/object-storage.provider';
import { SpeechController } from './speech.controller';
import { SpeechService } from './speech.service';

@Module({
  imports: [AssessModule, ConfigModule],
  controllers: [SpeechController],
  providers: [SpeechService, ClovaSttProvider, ObjectStorageProvider],
  exports: [SpeechService],
})
export class SpeechModule {}
