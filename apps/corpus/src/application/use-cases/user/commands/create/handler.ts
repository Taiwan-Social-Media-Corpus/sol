import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserService } from '@sol/corpus/application/services/users';
import { JwtService } from '@sol/jwt';
import { CreateUserCommand } from './command';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: CreateUserCommand) {
    const refreshToken = this.jwtService.generateRefreshToken();
    const userResult = await this.createUserService.execute({
      ...command,
      refreshToken,
    });

    if (userResult.isErr()) {
      throw userResult.getError();
    }

    return userResult.getValue();
  }
}
