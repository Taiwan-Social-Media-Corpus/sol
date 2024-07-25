import { FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User, UserRepository as _UserRepository } from '@sol/postgres';
import { UserMapper } from '../mappers';

@Injectable()
class UserRepository {
  constructor(private readonly userRepository: _UserRepository) {}

  async findOne(options: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOne(options);
    if (!user) {
      return user;
    }
    return UserMapper.toDomain(user);
  }

  async save(user: User) {
    this.userRepository.create(user);
    return UserMapper.toDomain(user);
  }
}

export default UserRepository;
