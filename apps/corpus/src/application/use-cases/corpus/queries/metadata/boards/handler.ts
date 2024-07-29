import { InternalServerErrorException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MetaData } from '@sol/corpus/application/types/blacklab';
import { env } from '@sol/env';
import { request } from '@sol/requests';
import { GetCorpusBoardsQuery } from './query';

@QueryHandler(GetCorpusBoardsQuery)
export class GetCorpusBoardsQueryHandler
  implements IQueryHandler<GetCorpusBoardsQuery>
{
  constructor() {}

  private generateBoards(boards: string[], mediaPattern: RegExp) {
    return boards.reduce((acc: string[], cur) => {
      const match = cur.match(mediaPattern);
      if (match) acc.push(match[0]);
      return acc;
    }, []);
  }

  async execute(query: GetCorpusBoardsQuery) {
    const url = `${env.corpusURL}/fields/board`;
    const [data, error] = await request<any, MetaData>({
      url,
      method: 'GET',
      query: { outputformat: 'json' },
    });

    if (!data || error) {
      throw new InternalServerErrorException('Internal Blacklab Server Error');
    }

    const boards = Object.keys(data.fieldValues);
    const dto = {
      ptt: this.generateBoards(boards, /.*(?=-ptt)/),
      dcard: this.generateBoards(boards, /.*(?=-dcard)/),
    };
    if (query.board) {
      return dto[query.board as keyof typeof dto];
    }
    return dto;
  }
}
