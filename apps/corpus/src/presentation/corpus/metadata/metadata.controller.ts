import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetCorpusInfoQuery,
  GetCorpusMediaQuery,
  GetCorpusBoardsQuery,
} from '@sol/corpus/application/use-cases/corpus/queries';

@Controller('corpus')
class CorpusMetadataController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getInfo() {
    const data = await this.queryBus.execute(new GetCorpusInfoQuery());
    return { success: true, data };
  }

  @Get('media')
  async getMedia() {
    const data = await this.queryBus.execute(new GetCorpusMediaQuery());
    return { success: true, data };
  }

  @Get('boards')
  async getBoards(@Query() query: { board?: string }) {
    const data = await this.queryBus.execute(new GetCorpusBoardsQuery(query));
    return { success: true, data };
  }
}

export default CorpusMetadataController;
