import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminRepository } from '@sol/admin/infrastructure/repositories';
import { CookiesService } from '@sol/cookies';
import Definition from '@sol/definition';
import { JwtService } from '@sol/jwt';

@Injectable()
class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminRepository: AdminRepository,
    private readonly cookiesService: CookiesService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const cookies = request.context.getCookies();
    const jwtCookie = cookies.get(Definition.Cookies.AdminAuthToken, {
      signed: true,
    });
    if (!jwtCookie) {
      return false;
    }

    const jwt = await this.jwtService.verify(jwtCookie);
    if (!jwt) {
      throw new UnauthorizedException('JWT expired');
    }

    const adminEntity = await this.adminRepository.findOne({
      id: jwt.payload.uid,
    });
    if (!adminEntity || adminEntity.refreshToken !== jwt.payload.refreshToken) {
      this.cookiesService.remove(response, [
        Definition.Cookies.AdminAuthToken,
        Definition.Cookies.AdminAuthTokenSig,
      ]);
      return false;
    }

    request.context = {
      ...request.context,
      getAdmin: () => adminEntity,
    };
    return true;
  }
}

export default AdminGuard;
