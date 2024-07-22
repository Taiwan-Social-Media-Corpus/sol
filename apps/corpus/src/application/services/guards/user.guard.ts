import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserRepository } from '@sol/corpus/infrastructure/repositories';
import { CookiesService } from '@sol/cookies';
import Definition from '@sol/definition';
import { JwtService } from '@sol/jwt';

@Injectable()
class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly cookiesService: CookiesService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const cookies = request.context.getCookies();
    const jwtCookie = cookies.get(Definition.Cookies.UserAuthToken, {
      signed: true,
    });
    if (!jwtCookie) {
      return false;
    }

    const jwt = await this.jwtService.verify(jwtCookie);
    if (!jwt) {
      throw new UnauthorizedException('JWT expired');
    }
    const userEntity = await this.userRepository.findOne({
      id: jwt.payload.uid,
    });
    if (!userEntity || userEntity.refreshToken !== jwt.payload.refreshToken) {
      this.cookiesService.remove(response, [
        Definition.Cookies.UserAuthToken,
        Definition.Cookies.UserAuthTokenSig,
      ]);
      return false;
    }

    request.context = {
      ...request.context,
      getUser: () => userEntity,
    };
    return true;
  }
}

export default UserGuard;
