import { Injectable } from '@nestjs/common';

import { ClovaService } from '../clova/clova.service';
import { buildNormalizePrompt } from './normalize.prompt';
import { NormalizeResult, NormalizeResultSchema } from './normalize.schema';

function safeJsonParse(text: string) {
  // 모델이 가끔 앞뒤에 공백/설명을 섞는 경우를 대비한 최소 방어
  const trimmed = text.trim();

  // JSON만 요구했지만 혹시라도 앞뒤 텍스트가 섞이면 첫 '{'부터 마지막 '}'까지 잘라 파싱 시도
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model output is not JSON');
  }

  const jsonText = trimmed.slice(start, end + 1);
  return JSON.parse(jsonText);
}

@Injectable()
export class SpeechNormalizeService {
  constructor(private readonly clova: ClovaService) {}

  async normalize(sttText: string): Promise<{ requestId: string; result: NormalizeResult }> {
    const { system, user } = buildNormalizePrompt(sttText);

    const { requestId, content, raw } = await this.clova.chat(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      { maxCompletionTokens: 1000, temperature: 0.1 },
    );

    console.log('Model raw response:', raw); // 디버그용 전체 응답 로그
    if (!content) throw new Error('Empty model content');
    const parsed = safeJsonParse(content);
    const result = NormalizeResultSchema.parse(parsed);

    // confidence가 없으면 서버에서 기본값을 주는 것도 가능 (여기선 옵션 유지)
    return { requestId, result };
  }
}
