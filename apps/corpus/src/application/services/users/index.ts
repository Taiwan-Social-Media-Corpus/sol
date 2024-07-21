import CreateUserService from './user/user-create.service';
import GetUserService from './user/user-get.service';

const userServices = [CreateUserService, GetUserService] as const;

export { CreateUserService, GetUserService, userServices };
