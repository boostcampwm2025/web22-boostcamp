import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SpeechModule } from './speech/speech.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SpeechModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
