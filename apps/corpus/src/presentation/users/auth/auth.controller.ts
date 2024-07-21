import { Request, Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { Controller, Get, Req, Res, Query } from '@nestjs/common';
import { CreateUserCommand } from '@sol/corpus/application/use-cases/user/commands';
import type { UserAggregate } from '@sol/corpus/domain/models/aggregate-root';
import { UserRepository } from '@sol/corpus/infrastructure/repositories';
import { CookiesService } from '@sol/cookies';
import Definition from '@sol/definition';
import { env } from '@sol/env';
import { JwtService } from '@sol/jwt';
import { OAuthService } from '@sol/oauth';

@Controller('user/auth')
class UserAuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
    private readonly oauthService: OAuthService,
    private readonly cookiesService: CookiesService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get('url')
  async getAuthUrl(@Req() req: Request) {
    const cookies = req.context.getCookies();
    const hasJWT = cookies.get(Definition.Cookies.UserAuthToken, {
      signed: true,
    });
    if (hasJWT) {
      return { success: true, data: { url: env.clientURL } };
    }
    const url = this.oauthService.getAuthUrl();
    return { success: true, data: { url } };
  }

  @Get('callback')
  async callback(
    @Query() query: { code?: string; error?: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { code, error } = query;
    if (error || !code) {
      return res.redirect(env.clientURL);
    }

    const userData = await this.oauthService.getUser(code);
    if (userData === null) {
      return res.redirect(env.clientURL);
    }

    let userEntity = await this.userRepository.findOne({
      email: userData.email,
    });
    if (userEntity === null) {
      userEntity = await this.commandBus.execute<
        CreateUserCommand,
        UserAggregate
      >(
        new CreateUserCommand({
          email: userData.email,
          firstName: userData.given_name ?? '',
          lastName: userData.family_name ?? '',
          picture: userData.picture ?? '',
        }),
      );
    } else {
      const refreshToken = this.jwtService.generateRefreshToken();
      userEntity.setRefreshToken(refreshToken);
      userEntity.registerRefreshTokenUpdateEvent();
      userEntity.commit();
    }

    const jwt = await this.jwtService.sign({
      refreshToken: userEntity.refreshToken,
      id: userEntity.id,
    });
    const cookies = req.context.getCookies();
    this.cookiesService.set(cookies, Definition.Cookies.UserAuthToken, jwt, {
      signed: true,
    });
    return res.redirect(env.clientURL);
  }
}

export default UserAuthController;
