import {
  BeforeInsert,
  Column,
  ColumnType,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryColumnOptions,
  UpdateDateColumn,
} from 'typeorm';
import { env } from '@sol/env';
import { createId } from '@paralleldrive/cuid2';

export function adaptType(type: ColumnType) {
  if (env.nodeEnv !== 'production') {
    return type;
  }

  switch (type) {
    case 'timestamp':
      return 'text';
    case 'char':
      return 'text';
    case 'json':
      return 'text';
    default:
      return type;
  }
}

export function PrimaryCuidColumn(
  options?: Omit<PrimaryColumnOptions, 'length' | 'type'>,
) {
  const { primary = false, nullable = false, comment } = options || {};
  return primary
    ? PrimaryColumn({
        type: adaptType('char'),
        length: 25,
        comment,
      })
    : Column({ nullable, type: adaptType('char'), length: 25, comment });
}

export class CreateDateEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}

export class UpdateDateEntity extends CreateDateEntity {
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}

export class TimeEntity extends UpdateDateEntity {}

export class DefaultEntity extends TimeEntity {
  @PrimaryCuidColumn({ primary: true })
  id!: string;

  @BeforeInsert()
  initPrimaryKey() {
    if (!this.id) {
      this.id = createId();
    }
  }
}
