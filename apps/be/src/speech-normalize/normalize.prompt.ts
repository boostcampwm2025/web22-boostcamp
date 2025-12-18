export function buildNormalizePrompt(sttText: string) {
  const system = `
너는 음성 인식(STT) 결과를 정리하는 역할이다.
목표는 '의도 추정'이지 '정답 판단'이 아니다.

규칙:
- 불확실한 발화(웅얼거림/끊김/발음 오류/단어 추정)는 [UNCLEAR:<짧은 이유>] 태그로 표시한다.
- CS 개념의 옳고 그름은 판단하지 않는다.
- 사용자의 의도를 최대한 보존하되, 추정한 부분은 반드시 표시한다.
- 새로운 정보를 추가하지 않는다.
- 출력은 JSON으로만 한다. (코드블록 금지)
출력 JSON 스키마:
{
  "normalized_text": string,
  "unclear_segments": string[],
  "confidence"?: number (0~1)
}
`.trim();

  const user = `[STT 결과]\n"${sttText}"`;

  return { system, user };
}
