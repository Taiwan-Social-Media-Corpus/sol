import CorpusConcordanceController from './corpus/concordance/concordance.controller';
import CorpusMetadataController from './corpus/metadata/metadata.controller';
import UserAuthController from './users/auth/auth.controller';
import UserCsrfController from './users/csrf/csrf.controller';
import UserRefreshController from './users/refresh/refresh.controller';
import UserSessionsController from './users/sessions/sessions.controller';

const controllers = [
  CorpusConcordanceController,
  CorpusMetadataController,
  UserAuthController,
  UserCsrfController,
  UserRefreshController,
  UserSessionsController,
];

export {
  controllers,
  CorpusConcordanceController,
  CorpusMetadataController,
  UserAuthController,
  UserCsrfController,
  UserRefreshController,
  UserSessionsController,
};
