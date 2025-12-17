// 클라이언트에게 음성 인식 결과를 반환하는 DTO입니다. text이고,
// TODO: 아직 구조를 맞추지는 않은 상황이므로, 변환된 텍스트 스크립트만 반환합니다.
export class SpeechResponseDto {
  readonly transcript!: string;
}