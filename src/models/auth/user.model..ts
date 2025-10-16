import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_user' })
  idUser: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 256, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  @Exclude()
  photoUrl?: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  @Exclude()
  createdAt?: Timestamp;

  @Column({ nullable: true })
  @Exclude()
  accessLevel?: number;

  @Column({ nullable: true })
  @Exclude()
  isActive?: boolean;

  @Column({ nullable: true })
  @Exclude()
  emailConfirmed?: boolean;
}
