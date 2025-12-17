import { Module } from '@nestjs/common';
import { SpeechController } from './speech.controller';
import { SpeechService } from './speech.service';
import { ClovaSttProvider } from './provider/clova-stt.provider';
import { ObjectStorageProvider } from './provider/object-storage.provider';

@Module({
  controllers: [SpeechController],
  providers: [
    SpeechService,
    ClovaSttProvider,
    ObjectStorageProvider,
  ],
})
export class SpeechModule {}