import type Cookies from 'cookies';

export interface BaseContext {
  getCookies: () => Cookies;
}

declare global {
  namespace Express {
    interface Request {
      context: BaseContext;
    }
  }
}

export {};
