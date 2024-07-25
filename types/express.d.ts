import type Cookies from 'cookies';
import type { AdminAggregate } from '@sol/admin/domain/models/aggregate-root';
import type { UserAggregate } from '@sol/corpus/domain/models/aggregate-root';

declare global {
  namespace Express {
    interface Request {
      context: {
        getAdmin: () => AdminAggregate;
        getUser: () => UserAggregate;
        getCookies: () => Cookies;
      };
    }
  }
}

export {};
