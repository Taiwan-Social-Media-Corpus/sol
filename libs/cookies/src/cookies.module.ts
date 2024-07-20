import { Module } from '@nestjs/common';
import { CookiesService, CsrfTokenService } from './services';

@Module({
  providers: [CookiesService, CsrfTokenService],
  exports: [CookiesService, CsrfTokenService],
})
export class CookieModule {}
