import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from '../entities';

@Injectable()
class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async exists(options: FindOptionsWhere<User>) {
    return this._userRepository
      .count({ where: options })
      .then((count) => count > 0);
  }

  async findOne(options: FindOptionsWhere<User>) {
    return this._userRepository.findOne({ where: options });
  }

  async create(user: User) {
    return this._userRepository.save(user);
  }

  async update(
    criteria: FindOptionsWhere<User>,
    partialEntity: QueryDeepPartialEntity<User>,
  ) {
    return this._userRepository.update(criteria, partialEntity);
  }
}

export default UserRepository;
