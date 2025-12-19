export type Level = 'junior' | 'mid' | 'senior';

export interface AssessRequestDto {
  topic: string; // ex) "UDP"
  level: Level; // ex) "junior"
  sttText: string; // STT raw text
}

export interface AssessResponseDto {
  normalize: {
    requestId: string;
    normalized_text: string;
    unclear_segments: string[];
    confidence?: number;
  };
  evaluation: {
    requestId: string;
    result: unknown; // EvaluationResult 타입으로 바꿔도 됨
  };
}
