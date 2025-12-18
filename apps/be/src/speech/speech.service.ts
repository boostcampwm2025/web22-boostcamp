import { BadRequestException, Injectable } from '@nestjs/common';

import { AssessService } from '../assess/assess.service';
import { SpeechRequestDto } from './dto/speech-request.dto';
import { ClovaSttProvider } from './provider/clova-stt.provider';
import { ObjectStorageProvider } from './provider/object-storage.provider';
import { normalizeAudio } from '../common/audio/normalize-audio';

@Injectable()
export class SpeechService {
  constructor(
    private readonly storage: ObjectStorageProvider,
    private readonly clova: ClovaSttProvider,
    private readonly assessService: AssessService,
  ) {}

  async transcribe(
    file: Express.Multer.File,
    dto: SpeechRequestDto,
  ): Promise<{ transcript: string; assessment: any }> {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    console.log({
      originalName: file.originalname,
      mime: file.mimetype,
      size: file.size,
    });

    const { buffer, contentType, filename } = await normalizeAudio(file);

    const objectKey = await this.storage.upload(buffer, contentType, filename);
    const language = dto.language ?? 'ko-KR';
    const result = await this.clova.requestSTT(objectKey, language);

    const assessment = await this.assessService.assess({
      topic: 'UDP',
      level: 'junior',
      sttText: result,
    });

    return { transcript: result, assessment };
  }
}
