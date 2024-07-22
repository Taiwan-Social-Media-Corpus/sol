import { FindOptionsWhere } from 'typeorm';
import { EventPublisher } from '@nestjs/cqrs';
import { User } from '@sol/postgres';
import { Injectable } from '@nestjs/common';
import { UserMapper } from '../mappers';
import { UserRepository as _UserRepository } from '@sol/postgres';

@Injectable()
class UserRepository {
  constructor(
    private readonly userRepository: _UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async findOne(options: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOne({
      where: options,
    });
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
