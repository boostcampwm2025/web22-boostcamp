import { Body, Controller, Post } from '@nestjs/common';

import { SpeechNormalizeService } from './speech-normalize.service';

@Controller('speech-normalize')
export class SpeechNormalizeController {
  constructor(private readonly svc: SpeechNormalizeService) {}

  @Post()
  async normalize(@Body('sttText') sttText: string) {
    const { requestId, result } = await this.svc.normalize(sttText);
    return { requestId, ...result };
  }
}
