import { Response, Request } from 'express';
import {
  UseGuards,
  Controller,
  Post,
  Delete,
  Body,
  UsePipes,
  Res,
  Req,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AdminGuard } from '@sol/admin/application/services/guards';
import { ZodValidationPipe } from 'libs/pipes';
import { LoginAdminDto, loginAdminSchema } from './login.dto';
import { AdminLoginQuery } from '@sol/admin/application/use-cases/admin/queries';
import { AdminAggregate } from '@sol/admin/domain/models/aggregate-root';
import { JwtService } from '@sol/jwt';
import { CookiesService } from '@sol/cookies';
import { AdminMapper } from '@sol/admin/infrastructure/mappers';
import Definition from '@sol/definition';

@Controller('admin/sessions')
class AdminSessionsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(loginAdminSchema))
  async login(
    @Body() loginAdminDto: LoginAdminDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const adminEntity = await this.queryBus.execute<
      AdminLoginQuery,
      AdminAggregate
    >(new AdminLoginQuery(loginAdminDto));
    const refreshToken = this.jwtService.generateRefreshToken();
    adminEntity.setRefreshToken(refreshToken);
    adminEntity.registerRefreshTokenUpdateEvent();
    const dto = AdminMapper.toDto(adminEntity);
    const jwt = await this.jwtService.sign({ refreshToken, id: dto.id });
    const cookies = req.context.getCookies();
    this.cookiesService.set(cookies, Definition.Cookies.AdminAuthToken, jwt, {
      signed: true,
    });
    adminEntity.commit();
    return res.status(200).json({ success: true, data: dto });
  }

  @Delete()
  @UseGuards(AdminGuard)
  async logout(@Res() res: Response) {
    this.cookiesService.remove(res, [
      Definition.Cookies.AdminAuthToken,
      Definition.Cookies.AdminAuthTokenSig,
    ]);
    return res.status(204).json();
  }
}

export default AdminSessionsController;
