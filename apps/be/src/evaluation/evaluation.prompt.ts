import { CsRubric } from './rubric.types';

export function buildEvaluationPrompt(args: {
  rubric: CsRubric;
  normalizedText: string;
  unclearSegments: string[];
}) {
  const { rubric, normalizedText, unclearSegments } = args;

  const system = `
너는 CS 개념 설명을 채점하는 평가 엔진이다.
반드시 입력으로 주어진 Rubric(평가기준)만 사용해서 평가한다.

규칙:
- 사용자가 말하지 않은 내용을 추측하지 마라.
- 정답을 장문으로 강의하지 마라. "평가/지적/개선"만 한다.
- 동의어(synonyms)는 의미가 동등하면 충족으로 인정한다.
- unclear_segments에 포함된 항목은 '표현 불명확' 감점 대상으로 처리한다.
- 출력은 하단 스키마를 준수한 유효한 JSON으로만 반환한다. 코드블록 금지. 설명, 주석, 추가 텍스트를 절대 포함하지 마라.

[출력 JSON 스키마]
{
  "topic": string,
  "level": string,
  "keyword_hits": Record<string, boolean>,
  "score": {
    "overall": number,
    "concept_understanding": number,
    "terminology_accuracy": number,
    "clarity": number
  },
  "issues": Array<{
    "type": "missing_required" | "misconception" | "unclear_expression" | "structure_issue",
    "id": string,
    "detail": string,
    "evidence": string
  }>,
  "summary": string,
  "fix_suggestions": string[],
  "followup_questions": string[]
}
`.trim();

  const user = `
[Rubric]
${JSON.stringify(rubric)}

[User Explanation (normalized)]
${normalizedText}

[unclear_segments]
${JSON.stringify(unclearSegments)}
`.trim();

  return { system, user };
}
