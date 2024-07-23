import { FindOptionsWhere } from 'typeorm';
import { EventPublisher } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { User, UserRepository as _UserRepository } from '@sol/postgres';
import { UserMapper } from '../mappers';

@Injectable()
class UserRepository {
  constructor(
    private readonly userRepository: _UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async findOne(options: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOne(options);
    if (!user) {
      return user;
    }
    const userEntity = UserMapper.toDomain(user);
    return this.eventPublisher.mergeObjectContext(userEntity);
  }

  async save(user: User) {
    this.userRepository.create(user);
    return UserMapper.toDomain(user);
  }
}

export default UserRepository;
