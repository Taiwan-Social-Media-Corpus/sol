import { Res, UnauthorizedException } from '@nestjs/common';
import { ValueObject } from '@sol/domain/model/interfaces/value-object';
import { Result } from '@sol/result';
import Definition from '@sol/definition';

export interface AdminRoleVOProps {
  value: number;
}

export class AdminRoleVO extends ValueObject<AdminRoleVOProps> {
  constructor(props: AdminRoleVOProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  getValue() {
    return this.props.value;
  }

  validateRole() {
    const roles = Object.values(Definition.AdminRole).filter(
      (role) => typeof role === 'number',
    );
    const hasRole = roles.includes(this.props.value);
    if (!hasRole) {
      return Result.Err(new UnauthorizedException('Invalid role'));
    }
    return Result.Ok(null);
  }

  public static create(props: AdminRoleVOProps) {
    return new AdminRoleVO({ value: props.value });
  }
}
