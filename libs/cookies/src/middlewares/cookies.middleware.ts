import Cookies from 'cookies';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { env } from '@sol/env';

@Injectable()
export class CookiesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const secrets = Array.isArray(env.cookieSignatureSecret)
      ? env.cookieSignatureSecret
      : [env.cookieSignatureSecret];

    req.context = {
      ...req.context,
      getCookies: () => new Cookies(req, res, { keys: secrets }),
    };
    next();
  }
}
