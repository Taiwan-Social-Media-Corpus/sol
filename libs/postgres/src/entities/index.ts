import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import Admin from './admin.entity';
import User from './user.entity';

const entities: EntityClassOrSchema[] = [Admin, User] as const;

export { Admin, User, entities };
