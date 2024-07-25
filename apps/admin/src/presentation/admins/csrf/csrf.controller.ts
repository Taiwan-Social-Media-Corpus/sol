import { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { CsrfTokenService, CookiesService } from '@sol/cookies';
import Definition from '@sol/definition';

@Controller('admin/_ping')
class AdminCsrfController {
  constructor(
    private readonly csrfTokenService: CsrfTokenService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Get()
  async ping(@Req() req: Request, @Res() res: Response) {
    const csrfToken = this.csrfTokenService.generate();
    const hmac = this.csrfTokenService.hmac(csrfToken);
    res.header('X-Csrf-Token', hmac);

    const cookies = req.context.getCookies();
    this.cookiesService.set(cookies, Definition.Cookies.CsrfToken, csrfToken, {
      expires: undefined,
      sameSite: undefined,
    });
    return res.status(204).json();
  }
}

export default AdminCsrfController;
