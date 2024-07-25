import { Request, Response } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CheckUserRefreshTokenQuery } from '@sol/corpus/application/use-cases/user/queries';
import { UserAggregate } from '@sol/corpus/domain/models/aggregate-root/user';
import { CookiesService } from '@sol/cookies';
import Definition from '@sol/definition';
import { JwtService } from '@sol/jwt';

@Controller('user/refresh')
class UserRefreshController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Post()
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookies = req.context.getCookies();
    const jwtCookie = cookies.get(Definition.Cookies.UserAuthToken, {
      signed: true,
    });
    if (!jwtCookie) {
      throw new UnauthorizedException();
    }

    const jwt = this.jwtService.decode(jwtCookie);
    if (jwt === null) {
      throw new UnauthorizedException();
    }

    const userEntity = await this.queryBus.execute<
      CheckUserRefreshTokenQuery,
      UserAggregate
    >(
      new CheckUserRefreshTokenQuery({
        id: jwt.uid,
        refreshToken: jwt.refreshToken,
      }),
    );
    const refreshToken = this.jwtService.generateRefreshToken();
    userEntity.setRefreshToken(refreshToken);
    userEntity.registerRefreshTokenUpdateEvent();
    userEntity.commit();

    const newJwt = await this.jwtService.sign({
      refreshToken,
      id: userEntity.id,
    });
    this.cookiesService.set(cookies, Definition.Cookies.UserAuthToken, newJwt, {
      signed: true,
    });
    return res.status(200).json({ success: true });
  }
}

export default UserRefreshController;
