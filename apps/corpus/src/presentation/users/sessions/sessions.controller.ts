import { Request, Response } from 'express';
import { Delete, Controller, Req, Res, UseGuards, Get } from '@nestjs/common';
import { CookiesService } from '@sol/cookies';
import { UserGuard } from '@sol/corpus/application/services/guards';
import { UserMapper } from '@sol/corpus/infrastructure/mappers';
import Definition from '@sol/definition';
import { JwtService } from '@sol/jwt';

@UseGuards(UserGuard)
@Controller('user/sessions')
class UserSessionsController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Get()
  get(@Req() req: Request) {
    const userEntity = req.context.getUser();
    const dto = UserMapper.toDto(userEntity);
    return { success: true, data: dto };
  }

  @Delete()
  async delete(@Req() req: Request, @Res() res: Response) {
    const userEntity = req.context.getUser();
    const refreshToken = this.jwtService.generateRefreshToken();
    userEntity.setRefreshToken(refreshToken);
    userEntity.registerRefreshTokenUpdateEvent();
    userEntity.commit();

    this.cookiesService.remove(res, [
      Definition.Cookies.UserAuthToken,
      Definition.Cookies.UserAuthTokenSig,
    ]);
    return res.status(204).json();
  }
}

export default UserSessionsController;
