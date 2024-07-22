import { BaseContext } from 'types/express.d.ts';
import type { UserAggregate } from '@sol/corpus/domain/models/aggregate-root';

declare module 'express' {
  export interface Request {
    context: BaseContext & {
      getUser: () => UserAggregate;
    };
  }
}

export {};
