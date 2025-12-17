import { Injectable, BadRequestException } from '@nestjs/common';
import { ClovaSttProvider } from './provider/clova-stt.provider';
import { ObjectStorageProvider } from './provider/object-storage.provider';
import { SpeechRequestDto } from './dto/speech-request.dto';

@Injectable()
export class SpeechService {
  constructor(
    private readonly storage: ObjectStorageProvider,
    private readonly clova: ClovaSttProvider,
  ) {}

  async transcribe(
    file: Express.Multer.File,
    dto: SpeechRequestDto,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    const objectKey = await this.storage.upload(file);

    const language = dto.language ?? 'ko-KR';
    const result = await this.clova.requestSTT(objectKey, language);

    return result;
  }
}