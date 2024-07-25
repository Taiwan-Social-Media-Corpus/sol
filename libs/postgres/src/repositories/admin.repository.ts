import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Admin } from '../entities';

@Injectable()
class AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly _userRepository: Repository<Admin>,
  ) {}

  async exists(options: FindOptionsWhere<Admin>) {
    return this._userRepository
      .count({ where: options })
      .then((count) => count > 0);
  }

  async findOne(options: FindOptionsWhere<Admin>) {
    return this._userRepository.findOne({ where: options });
  }

  async create(admin: Admin) {
    return this._userRepository.save(admin);
  }

  async update(
    criteria: FindOptionsWhere<Admin>,
    partialEntity: QueryDeepPartialEntity<Admin>,
  ) {
    return this._userRepository.update(criteria, partialEntity);
  }
}

export default AdminRepository;
