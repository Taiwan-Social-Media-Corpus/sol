import { IsEmail } from 'class-validator';
import { Entity, Column, Index } from 'typeorm';
import { DefaultEntity } from '../common/columns';

@Entity('users')
class User extends DefaultEntity {
  constructor(args?: Partial<User>) {
    super();
    Object.assign(this, args);
  }

  @Column('varchar', { name: 'first_name' })
  firstName!: string;

  @Column('varchar', { name: 'last_name' })
  lastName!: string;

  @Index()
  @Column('text', { unique: true })
  @IsEmail()
  email!: string;

  @Column('text', { name: 'picture' })
  picture!: string;

  @Column('text', { name: 'refresh_token' })
  refreshToken!: string;

  @Column('boolean', { default: false })
  disabled!: boolean;
}

export default User;
