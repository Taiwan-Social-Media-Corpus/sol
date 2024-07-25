import { Request, Response } from 'express';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAdminCommand } from '@sol/admin/application/use-cases/admin/commands';
import { AdminAggregate } from '@sol/admin/domain/models/aggregate-root';
import { AdminMapper } from '@sol/admin/infrastructure/mappers';
import { CookiesService } from '@sol/cookies';
import Definition from '@sol/definition';
import { ZodValidationPipe } from 'libs/pipes';
import { JwtService } from '@sol/jwt';
import { AdminRepository } from '@sol/postgres';
import { createAdminSchema, CreateAdminDto } from './dto';

@Controller('admin')
class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
    private readonly cookiesService: CookiesService,
    private readonly adminRepository: AdminRepository,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAdminSchema))
  async signUp(
    @Body() createAdminDto: CreateAdminDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const hasEmail = await this.adminRepository.exists({
      email: createAdminDto.email,
    });
    if (hasEmail) {
      throw new UnauthorizedException();
    }

    const adminEntity = await this.commandBus.execute<
      CreateAdminCommand,
      AdminAggregate
    >(new CreateAdminCommand({ ...createAdminDto, roleId: 2 }));
    const refreshToken = this.jwtService.generateRefreshToken();
    adminEntity.setRefreshToken(refreshToken);
    adminEntity.registerRefreshTokenUpdateEvent();

    const jwt = await this.jwtService.sign({
      refreshToken: adminEntity.refreshToken,
      id: adminEntity.id,
    });
    const cookies = req.context.getCookies();
    this.cookiesService.set(cookies, Definition.Cookies.AdminAuthToken, jwt, {
      signed: true,
    });
    const dto = AdminMapper.toDto(adminEntity);
    adminEntity.commit();
    return res.status(201).json({ success: true, data: dto });
  }
}

export default AdminController;
