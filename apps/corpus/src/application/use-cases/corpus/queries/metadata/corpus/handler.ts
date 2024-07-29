import { InternalServerErrorException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { CorpusInfo } from '@sol/corpus/application/types/blacklab';
import { env } from '@sol/env';
import { request } from '@sol/requests';
import { GetCorpusInfoQuery } from './query';

@QueryHandler(GetCorpusInfoQuery)
export class GetCorpusInfoQueryHandler
  implements IQueryHandler<GetCorpusInfoQuery>
{
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetCorpusInfoQuery) {
    const [data, error] = await request<any, CorpusInfo>({
      url: `${env.corpusURL}`,
      method: 'GET',
      query: { outputformat: 'json' },
    });
    console.log(data);

    if (!data || error) {
      throw new InternalServerErrorException('Internal Blacklab Server Error');
    }

    const { displayName, versionInfo } = data;
    return {
      name: displayName,
      engine: {
        name: 'blacklab',
        core: 'Apache Lucene',
        version: versionInfo.blackLabVersion,
      },
      updatedAt: versionInfo.timeModified,
    };
  }
}
