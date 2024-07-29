import { GetCorpusConcordanceQueryHandler } from './corpus/queries/concordance/handler';
import { GetCorpusBoardsQueryHandler } from './corpus/queries/metadata/boards/handler';
import { GetCorpusInfoQueryHandler } from './corpus/queries/metadata/corpus/handler';
import { GetCorpusMediaQueryHandler } from './corpus/queries/metadata/media/handler';
import { CreateUserCommandHandler } from './user/commands/create/handler';
import { CheckUserRefreshTokenQueryHandler } from './user/queries/refreshToken/handler';

const cqrsHandlers = [
  GetCorpusConcordanceQueryHandler,
  GetCorpusBoardsQueryHandler,
  GetCorpusInfoQueryHandler,
  GetCorpusMediaQueryHandler,
  CreateUserCommandHandler,
  CheckUserRefreshTokenQueryHandler,
] as const;

export { cqrsHandlers };
