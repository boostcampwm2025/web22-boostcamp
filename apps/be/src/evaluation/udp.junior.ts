import { CsRubric } from './rubric.types';

export const UDP_JUNIOR_RUBRIC: CsRubric = {
  topic: 'UDP',
  level: 'junior',
  required_concepts: [
    {
      id: 'transport_layer',
      description: '전송 계층(Transport Layer) 프로토콜',
      synonyms: ['전송 계층', 'transport layer', 'L4', '4계층'],
      must: true,
    },
    {
      id: 'connectionless',
      description: '비연결형(연결 설정/세션 없음)',
      synonyms: ['비연결', '연결 과정 없음', '세션 없음', 'handshake 없음', '연결을 맺지 않음'],
      must: true,
    },
    {
      id: 'no_reliability',
      description: '신뢰성 보장 X(ACK/재전송 없음)',
      synonyms: ['신뢰성 보장 안 함', 'ACK 없음', '재전송 없음', 'loss 복구 없음'],
      must: true,
    },
    {
      id: 'no_ordering',
      description: '순서 보장 X',
      synonyms: ['순서 보장 안 함', 'ordering 없음', '순서 뒤바뀜'],
      must: true,
    },
    {
      id: 'low_overhead_fast',
      description: '오버헤드 낮고 빠름(지연 적음)',
      synonyms: ['오버헤드 낮음', '헤더가 단순', '빠르다', '지연이 낮다', 'latency 낮음'],
      must: true,
    },
  ],
  misconceptions: [
    {
      id: 'udp_handshake',
      description: 'UDP가 handshake/연결 설정을 한다고 설명',
      patterns: ['3-way', '핸드쉐이크', 'handshake', '연결 지향', 'connection-oriented'],
      severity: 'critical',
    },
    {
      id: 'udp_reliable',
      description: 'UDP가 신뢰성을 보장한다고 설명',
      patterns: ['신뢰성 보장', '재전송한다', '순서 보장'],
      severity: 'major',
    },
  ],
  // scoring_policy: {
  //   required_hit: 12, // 맞았으면 +12점
  //   required_miss: -10, // 놓쳤으면 -10점
  //   unclear_penalty: -2,
  //   misconception_penalty: { critical: -25, major: -12, minor: -6 },
  // },
};
