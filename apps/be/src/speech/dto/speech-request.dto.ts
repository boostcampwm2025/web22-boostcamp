import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SpeechRequestDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? 'ko-KR')
  language!: string;
}