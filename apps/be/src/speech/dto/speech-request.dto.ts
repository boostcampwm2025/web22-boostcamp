import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SpeechRequestDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? 'ko-KR')
  language!: string;
}
