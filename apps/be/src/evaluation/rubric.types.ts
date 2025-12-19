export type Level = 'junior' | 'mid' | 'senior';

export interface RequiredConcept {
  id: string; // "connectionless"
  description: string; // "비연결형(연결 과정/세션 없음)"
  synonyms: string[]; // STT 대비 동의어/표현
  must: boolean; // 필수 여부
}

export interface Misconception {
  id: string; // "udp_handshake"
  description: string; // "UDP에 handshake를 적용"
  patterns: string[]; // "3-way", "핸드쉐이크", ...
  severity: 'critical' | 'major' | 'minor';
}

export interface ScoringPolicy {
  required_hit: number; // 필수 개념 충족 시 가산
  required_miss: number; // 필수 개념 누락 시 감점(음수)
  unclear_penalty: number; // unclear 1개당 감점(음수)
  misconception_penalty: { critical: number; major: number; minor: number }; // 음수
}

export interface CsRubric {
  topic: string;
  level: Level;
  required_concepts: RequiredConcept[];
  misconceptions: Misconception[];
  //scoring_policy: ScoringPolicy;
}
