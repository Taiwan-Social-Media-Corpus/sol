import type Cookies from 'cookies';
import type { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { env } from '@sol/env';

export const setOptions: Cookies.SetOption = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict',
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  signed: false,
};

@Injectable()
export class CookiesService {
  set(
    cookies: Cookies,
    name: string,
    val: string,
    options?: Cookies.SetOption,
  ) {
    return cookies.set(name, val, { ...setOptions, ...options });
  }

  get(cookies: Cookies, name: string, signed: boolean = false) {
    return cookies.get(name, { signed });
  }

  remove(res: Response, name: string | string[]) {
    if (Array.isArray(name)) {
      name.forEach((cookieName) => {
        res.clearCookie(cookieName);
      });
    } else {
      res.clearCookie(name);
    }
  }
}
