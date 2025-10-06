import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeUrlPipe', () => {
  it('create an instance', () => {
    const mockSanitizer = {
      bypassSecurityTrustResourceUrl: (url: string) => url
    } as unknown as DomSanitizer;

    const pipe = new SafeUrlPipe(mockSanitizer);
    expect(pipe).toBeTruthy();
  });
});

