import { Request, Response } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CheckAdminRefreshTokenQuery } from '@sol/admin/application/use-cases/admin/queries';
import { AdminAggregate } from '@sol/admin/domain/models/aggregate-root';
import { CookiesService } from '@sol/cookies';
import Definition from '@sol/definition';
import { JwtService } from '@sol/jwt';

@Controller('admin/refresh')
class AdminRefreshController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Post()
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookies = req.context.getCookies();
    const jwtCookie = this.cookiesService.get(
      cookies,
      Definition.Cookies.AdminAuthToken,
      true,
    );
    if (!jwtCookie) {
      throw new UnauthorizedException();
    }
    const jwt = this.jwtService.decode(jwtCookie);
    if (jwt === null) {
      throw new UnauthorizedException();
    }
    const adminEntity = await this.queryBus.execute<
      CheckAdminRefreshTokenQuery,
      AdminAggregate
    >(
      new CheckAdminRefreshTokenQuery({
        id: jwt.uid,
        refreshToken: jwt.refreshToken,
      }),
    );
    const refreshToken = this.jwtService.generateRefreshToken();
    adminEntity.setRefreshToken(refreshToken);
    adminEntity.registerRefreshTokenUpdateEvent();
    const newJwt = await this.jwtService.sign({
      refreshToken,
      id: adminEntity.id,
    });
    this.cookiesService.set(
      cookies,
      Definition.Cookies.AdminAuthToken,
      newJwt,
      { signed: true },
    );

    adminEntity.commit();
    return res.status(200).json({ success: true });
  }
}

export default AdminRefreshController;
