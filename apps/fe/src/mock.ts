import type { Answer } from './features/learning/types/ai-answer';

export const ANSWER: Answer = {
  transcript:
    'UDP는 속도와 효율성을 중시하는 비연결형 통신 프로토콜로 연결 설정 없이 데이터를 바로 보내며 데이터 손실이나 순서가 바뀌어도 괜찮지 않은 실시간 서비스에 적합하다.',
  assessment: {
    normalize: {
      requestId: '56f5b0e9-1db1-4f16-b937-6048fa839b74',
      normalized_text:
        'UDP는 속도와 효율성을 중시하는 비연결형 통신 프로토콜로, 연결 설정 없이 데이터를 즉시 전송합니다. 데이터 손실 또는 순서 변경이 발생하더라도 문제가 되지 않아 실시간 서비스(예: 스트리밍, 온라인 게임 등)에 적합합니다.',
      unclear_segments: [],
      confidence: 0.95,
    },
    evaluation: {
      requestId: '688eedcc-f4ee-4e84-899d-8f4f3ab1e4f5',
      result: {
        topic: 'UDP',
        level: 'junior',
        keyword_hits: {
          transport_layer: false,
          connectionless: true,
          no_reliability: true,
          no_ordering: true,
          low_overhead_fast: false,
        },
        score: {
          overall: 7,
          concept_understanding: 8,
          terminology_accuracy: 7,
          clarity: 8,
        },
        issues: [
          {
            type: 'missing_required',
            id: 'transport_layer',
            detail: 'UDP가 전송 계층 프로토콜임을 명시적으로 언급하지 않음',
            evidence: "설명에서 '프로토콜'이라 표현했으나 전송 계층(L4) 소속임을 구체화하지 않음",
          },
          {
            type: 'missing_required',
            id: 'low_overhead_fast',
            detail: '낮은 오버헤드와 높은 속도에 대한 구체적 설명 부재',
            evidence:
              "'효율성 중시', '속도' 언급 있으나 헤더 단순함·지연 감소 등의 핵심 특징 생략됨",
          },
        ],
        summary:
          'UDP의 비연결형 특성, 신뢰성과 순서 보장 미제공, 실시간 서비스 적합성은 올바르게 설명되었으나, 전송 계층 프로토콜임과 낮은 오버헤드의 구체적 메커니즘 설명이 누락되었습니다.',
        fix_suggestions: [
          'UDP가 전송 계층(TCP/IP 모델 L4층) 프로토콜임을 명시할 것',
          '낮은 오버헤드를 위해 헤더 구조가 단순하며, 이로 인한 지연 감소 효과를 구체적으로 서술할 것',
        ],
        followup_questions: [
          'UDP의 헤더 구조가 TCP보다 단순한 이유는 무엇인가요?',
          'UDP 기반 애플리케이션에서 패킷 손실이 발생했을 때 어떤 방식으로 대처하나요?',
        ],
      },
    },
  },
};

export const FEEDBACK = {
  summary: ANSWER.assessment.evaluation.result.summary,
  fixSuggestions: ANSWER.assessment.evaluation.result.fix_suggestions,
  followupQuestions: ANSWER.assessment.evaluation.result.followup_questions,
};

export const TRANSCRIPT = ANSWER.transcript;
