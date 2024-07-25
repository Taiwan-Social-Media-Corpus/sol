import { FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Admin, AdminRepository as _AdminRepository } from '@sol/postgres';
import { AdminMapper } from '../mappers';

@Injectable()
class AdminRepository {
  constructor(private readonly adminRepository: _AdminRepository) {}

  async findOne(options: FindOptionsWhere<Admin>) {
    const admin = await this.adminRepository.findOne(options);
    if (!admin) {
      return admin;
    }
    return AdminMapper.toDomain(admin);
  }

  async save(admin: Admin) {
    this.adminRepository.create(admin);
    return AdminMapper.toDomain(admin);
  }
}

export default AdminRepository;
