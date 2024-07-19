import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import User from './user.entity';

const entities: EntityClassOrSchema[] = [User] as const;

export { User, entities };
