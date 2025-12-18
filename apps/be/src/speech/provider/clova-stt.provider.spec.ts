import { ConfigService } from '@nestjs/config';

import { ClovaSttProvider } from './clova-stt.provider';

// private 메서드 검증을 위해 any 캐스팅 사용 (네트워크 호출 없음)
describe('ClovaSttProvider URL join', () => {
  const mockConfig = {
    get: jest.fn(),
  } as unknown as ConfigService;

  const provider = new ClovaSttProvider(mockConfig);

  it('joins without trailing slash on base', () => {
    // @ts-ignore
    const url = (provider as any).joinUrl(
      'https://clovaspeech-gw.ncloud.com/external/v1/13923/hash',
      'recognizer/object-storage',
    );
    expect(url).toBe(
      'https://clovaspeech-gw.ncloud.com/external/v1/13923/hash/recognizer/object-storage',
    );
  });

  it('joins with trailing slash on base', () => {
    // @ts-ignore
    const url = (provider as any).joinUrl(
      'https://clovaspeech-gw.ncloud.com/external/v1/13923/hash/',
      'recognizer/object-storage',
    );
    expect(url).toBe(
      'https://clovaspeech-gw.ncloud.com/external/v1/13923/hash/recognizer/object-storage',
    );
  });

  it('handles path starting with slash', () => {
    // @ts-ignore
    const url = (provider as any).joinUrl(
      'https://clovaspeech-gw.ncloud.com/external/v1/13923/hash',
      '/recognizer/object-storage',
    );
    expect(url).toBe(
      'https://clovaspeech-gw.ncloud.com/external/v1/13923/hash/recognizer/object-storage',
    );
  });
});
