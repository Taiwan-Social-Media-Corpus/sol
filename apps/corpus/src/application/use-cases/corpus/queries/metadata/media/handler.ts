import { InternalServerErrorException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { env } from '@sol/env';
import { MetaData } from '@sol/corpus/application/types/blacklab';
import { request } from '@sol/requests';
import { GetCorpusMediaQuery } from './query';

@QueryHandler(GetCorpusMediaQuery)
export class GetCorpusMediaQueryHandler
  implements IQueryHandler<GetCorpusMediaQuery>
{
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetCorpusMediaQuery) {
    const [data, error] = await request<any, MetaData>({
      url: `${env.corpusURL}/fields/media`,
      method: 'GET',
      query: { outputformat: 'json' },
    });

    if (!data || error) {
      throw new InternalServerErrorException('Internal Blacklab Server Error');
    }
    return data.fieldValues;
  }
}
