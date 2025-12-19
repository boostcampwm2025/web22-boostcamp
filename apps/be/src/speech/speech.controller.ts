import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SpeechRequestDto } from './dto/speech-request.dto';
import { SpeechResponseDto } from './dto/speech-response.dto';
import { SpeechService } from './speech.service';

@Controller('speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post('stt')
  @UseInterceptors(FileInterceptor('audio'))
  async transcribe(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: SpeechRequestDto,
  ): Promise<SpeechResponseDto> {
    const { transcript, assessment } = await this.speechService.transcribe(file, dto);
    return { transcript, assessment };
  }
}
